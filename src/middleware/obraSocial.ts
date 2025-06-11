import { Request, Response, NextFunction } from "express";
import { ObrasSociales } from "../models";
import { IObraSocial } from "../models/ObrasSociales";

declare global {
  namespace Express {
    interface Request {
      obraSocial: IObraSocial;
    }
  }
}

export async function validateObraSocial(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { idObraSocial } = req.params;
    const obraSocial = await ObrasSociales.findById(idObraSocial);

    if (!obraSocial) {
      const error = new Error("Obra social no encontrada");
      res.status(404).json({ message: error.message });
      return;
    }

    req.obraSocial = obraSocial;
    next();
  } catch (error) {
    console.error("Error in validateObraSocial middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
