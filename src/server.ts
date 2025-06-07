import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

//Routes
import usuarioRoutes from "./routes/usuarioRoutes";
import obraSocialRoutes from "./routes/obraSocialRoute";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/obras-sociales", obraSocialRoutes);

export default app;
