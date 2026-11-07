import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import app from '../src/app.js';
import db from '../src/config/database.js';

// HTTP real con la frontera de MariaDB simulada: no altera datos del usuario.
const originalExecute = db.execute;
const originalQuery = db.query;
let server, base, handler, calls;
const datos = { codigo: 'ING-01', facultad_id: 1, nombre: 'Ingeniería', nivel: 'pregrado', modalidad: 'presencial' };
const programa = { id: 7, ...datos };

before(async () => {
    db.execute = async (sql, params = []) => {
        calls.push({ sql, params });
        assert.equal((sql.match(/\?/g) || []).length, params.length);
        return handler(sql, params);
    };
    db.query = async () => [[{ id: 1, nombre: 'Ingeniería' }]];
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    db.execute = originalExecute;
    db.query = originalQuery;
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await db.end();
});

beforeEach(() => {
    calls = [];
    handler = async sql => {
        if (sql.includes('FROM facultades')) return [[{ id: 1 }]];
        if (sql.includes('INSERT')) return [{ insertId: 7 }];
        if (sql.includes('UPDATE') || sql.includes('DELETE')) return [{ affectedRows: 1 }];
        return [[programa]];
    };
});

async function request(path, method = 'GET', body) {
    const response = await fetch(`${base}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const json = await response.json();
    if (path.startsWith('/api/programas')) {
        assert.equal(json.statusCode, response.status);
        assert.equal(json.success, response.status < 400);
    }
    return { status: response.status, body: json };
}
const api = (path, method, body) => request(`/api/programas${path}`, method, body);

test('health y facultades conservan sus rutas', async () => {
    assert.equal((await request('/api/health')).status, 200);
    assert.equal((await request('/api/facultades/show')).status, 200);
    assert.equal((await request('/api/facultades/info/1')).status, 200);
});

test('listar, consultar y lista vacía', async () => {
    assert.deepEqual((await api('/show')).body.data, [programa]);
    assert.deepEqual((await api('/info/7')).body.data, programa);
    assert.deepEqual(calls[1].params, [7]);
    handler = async () => [[]];
    assert.deepEqual((await api('/show')).body.data, []);
    assert.equal((await api('/info/7')).status, 404);
});

test('crear normaliza textos y parametriza contenido SQL', async () => {
    const codigo = "X'); DROP TABLE programas;--";
    const r = await api('/create', 'POST', { ...datos, codigo, nombre: ' Ingeniería ', facultad_id: '1' });
    assert.equal(r.status, 201);
    const insert = calls.find(c => c.sql.includes('INSERT'));
    assert.ok(!insert.sql.includes(codigo));
    assert.deepEqual(insert.params, [codigo, 1, datos.nombre, datos.nivel, datos.modalidad]);
});

test('actualizar, incluso sin cambios, y eliminar', async () => {
    assert.equal((await api('/update/7', 'PUT', datos)).status, 200);
    assert.deepEqual(calls.find(c => c.sql.includes('UPDATE')).params, [...Object.values(datos), 7]);
    handler = async sql => sql.includes('UPDATE') ? [{ affectedRows: 0 }] : [[programa]];
    assert.equal((await api('/update/7', 'PUT', datos)).status, 200);
    handler = async () => [{ affectedRows: 1 }];
    assert.equal((await api('/delete/7', 'DELETE')).status, 200);
});

test('actualizar y eliminar inexistentes devuelven 404', async () => {
    handler = async sql => sql.includes('DELETE') ? [{ affectedRows: 0 }] : [[]];
    assert.equal((await api('/update/7', 'PUT', datos)).status, 404);
    assert.equal((await api('/delete/7', 'DELETE')).status, 404);
});

for (const id of ['0', '-1', '1.5', 'abc', '1e2', '0x10', '4294967296', '1%20OR%201=1']) {
    test(`ID inválido: ${id}`, async () => {
        for (const [path, method, body] of [[`/info/${id}`, 'GET'], [`/update/${id}`, 'PUT', datos], [`/delete/${id}`, 'DELETE']]) {
            assert.equal((await api(path, method, body)).status, 400);
        }
        assert.equal(calls.length, 0);
    });
}

const invalidos = [
    undefined, {}, [],
    ...['', ' ', 123, 'a'.repeat(31)].map(codigo => ({ ...datos, codigo })),
    ...['', 'ab', 123, 'a'.repeat(151)].map(nombre => ({ ...datos, nombre })),
    ...[null, true, {}, 0, -1, 1.5, 'abc', 4294967296].map(facultad_id => ({ ...datos, facultad_id })),
    ...['PREGRADO', 'doctorado', null].map(nivel => ({ ...datos, nivel })),
    ...['híbrida', 'remota', null].map(modalidad => ({ ...datos, modalidad }))
];
invalidos.forEach((body, i) => test(`cuerpo inválido ${i + 1} en POST y PUT`, async () => {
    assert.equal((await api('/create', 'POST', body)).status, 400);
    assert.equal((await api('/update/7', 'PUT', body)).status, 400);
    assert.equal(calls.length, 0);
}));

test('acepta límites de longitud y todos los ENUM', async () => {
    for (const nivel of ['pregrado', 'posgrado', 'otro']) {
        for (const modalidad of ['presencial', 'virtual', 'hibrida']) {
            assert.equal((await api('/create', 'POST', { ...datos, codigo: 'a'.repeat(30), nombre: 'a'.repeat(150), nivel, modalidad })).status, 201);
        }
    }
});

test('facultad ausente devuelve 404 y no escribe', async () => {
    handler = async sql => sql.includes('FROM facultades') ? [[]] : [[programa]];
    assert.equal((await api('/create', 'POST', datos)).status, 404);
    assert.equal((await api('/update/7', 'PUT', datos)).status, 404);
    assert.ok(calls.every(c => !/INSERT|UPDATE/.test(c.sql)));
});

for (const code of ['ER_DUP_ENTRY', 'ER_NO_REFERENCED_ROW_2']) {
    test(`${code} devuelve 409 al crear y actualizar`, async () => {
        handler = async sql => {
            if (/INSERT|UPDATE/.test(sql)) throw Object.assign(new Error('detalle privado SQL'), { code });
            return [[programa]];
        };
        for (const [path, method] of [['/create', 'POST'], ['/update/7', 'PUT']]) {
            const r = await api(path, method, datos);
            assert.equal(r.status, 409);
            assert.ok(!JSON.stringify(r.body).includes('detalle privado'));
        }
    });
}

test('eliminar programa referenciado devuelve 409', async () => {
    handler = async () => { throw Object.assign(new Error('FK'), { errno: 1451 }); };
    assert.equal((await api('/delete/7', 'DELETE')).status, 409);
});

test('error inesperado devuelve 500 sin exponer SQL', async () => {
    handler = async () => { throw new Error('detalle privado SQL'); };
    const originalError = console.error;
    console.error = () => {};
    try {
        const r = await api('/show');
        assert.equal(r.status, 500);
        assert.ok(!JSON.stringify(r.body).includes('detalle privado'));
    } finally {
        console.error = originalError;
    }
});
