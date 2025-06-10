import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import "./models";

//Routes
import usuarioRoutes from "./routes/usuarioRoutes";
import codigoRoutes from "./routes/codigoRoutes";
import obraSocialRoutes from "./routes/obraSocialRoute";
import pacienteRoutes from "./routes/pacienteRoutes";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/obras-sociales", obraSocialRoutes);

export default app;
