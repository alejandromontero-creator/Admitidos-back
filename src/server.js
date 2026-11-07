import app from "./app.js";
import {connectDB} from "./config/database.js";


const PORT = Number(process.env.PORT) || 3000;  
const HOST = process.env.HOST;
const APP_NAME = process.env.app_name;

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB conectado correctamente");

    app.listen(PORT, HOST, () => {
  console.log(APP_NAME);
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
  } catch (error) {
    console.error("error al conectar a MongoDB:", error);
  }  
}
startServer();