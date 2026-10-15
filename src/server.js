import app from "./app.js";
import db from "./config/database.js";


const PORT = Number(process.env.PORT) || 3000;  
const HOST = process.env.HOST;
const APP_NAME = process.env.app_name;

async function startServer() {
  try {
    await db.execute("SELECT 1");
    console.log("base de datos conectada correctamente");

    app.listen(PORT, HOST, () => {
  console.log(APP_NAME);
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
  } catch (error) {
    console.error("error al conectar a la base de datos:", error);
  }  
}
startServer();