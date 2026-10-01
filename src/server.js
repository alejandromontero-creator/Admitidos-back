import express from "express";

const app = express();

const PORT = 3000;

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        success: true,
        message: "API functioning correctly",
        version: "1.0.0"
    })
});

app.listen(PORT, ()=> {
    console.log(`server is running on http://localhost:${PORT}`);
});