import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { connectDB } from "./config/db";

import "./models";

//Routes
import usuarioRoutes from "./routes/usuarioRoutes";
import codigoRoutes from "./routes/codigoRoutes";
import obraSocialRoutes from "./routes/obraSocialRoutes";
import pacienteRoutes from "./routes/pacienteRoutes";
import registrosRoutes from "./routes/registrosRoutes";
import morgan from "morgan";

dotenv.config();
connectDB();
const app = express();
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/registros", registrosRoutes);
app.use("/api/obras-sociales", obraSocialRoutes);

export default app;
