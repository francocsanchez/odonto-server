import { Request, Response, NextFunction } from "express";
import { Pacientes } from "../models";
import { IPaciente } from "../models/Pacientes";

declare global {
  namespace Express {
    interface Request {
      paciente: IPaciente;
    }
  }
}

export async function validatePaciente(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { idPaciente } = req.params;
    const paciente = await Pacientes.findById(idPaciente);

    if (!paciente) {
      const error = new Error("Paciente no encontrada");
      res.status(404).json({ message: error.message });
      return;
    }

    req.paciente = paciente;
    next();
  } catch (error) {
    console.error("Error in validatePaciente middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
