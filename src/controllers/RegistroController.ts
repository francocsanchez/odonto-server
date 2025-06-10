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

  static getRegistrosPagados = async (req: Request, res: Response) => {
    try {
      const registros = await Registros.find({ pagado: true });
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los registros pagados" });
    }
  };

  static getRegistrosPendientes = async (req: Request, res: Response) => {
    try {
      const registros = await Registros.find({ pagado: false });
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los registros pendientes" });
    }
  };

  static pagarRegistro = async (req: Request, res: Response) => {
    const { idRegistro } = req.params;
    const { pagado } = req.body;

    try {
      const registro = await Registros.findByIdAndUpdate(idRegistro, { pagado }, { new: true });
      if (!registro) {
        res.status(404).json({ message: "Registro no encontrado" });
        return;
      }
      res.status(200).json({ message: "Registro pagado" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el registro" });
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

      const registroGuardado = await nuevoRegistro.save();
      res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el registro" });
    }
  };
}
