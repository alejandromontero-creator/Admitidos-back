import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    success: true,
    message: "API functioning correctly",
    version: "1.0.0",
  });
});

export default app;