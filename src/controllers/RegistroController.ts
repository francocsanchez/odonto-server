import { Request, Response } from "express";
import Registros from "../models/Registros";
export class RegistroController {
  static getAllRegistros = async (req: Request, res: Response) => {
    try {
      const registros = await Registros.find();
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los registros" });
    }
  };

  static createRegistro = async (req: Request, res: Response) => {
    const { fechaAtencion, usuario, paciente, atencion } = req.body;

    try {
      const nuevoRegistro = new Registros({
        fechaAtencion,
        usuario,
        paciente,
        atencion,
      });

      req.paciente.registros.push(nuevoRegistro.id);

      await Promise.allSettled([nuevoRegistro.save(), req.paciente.save()]);

      res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el registro" });
    }
  };
}
