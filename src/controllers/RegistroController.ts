import { Request, Response } from "express";
import Registros from "../models/Registros";
import { Codigos, Pacientes } from "../models";
export class RegistroController {
  static getAllRegistros = async (req: Request, res: Response) => {
    try {
      const registros = await Registros.find();
      res.status(200).json(registros);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los registros" });
    }
  };

  static crearRegistro = async (req: Request, res: Response) => {
    try {
      const { fechaAtencion, paciente, atencion } = req.body;

      // Obtener todos los códigos usados
      const codigosIds = atencion.map((a) => a.codigo);
      const codigosDB = await Codigos.find({ _id: { $in: codigosIds } });

      // Transformar cada atención
      const atencionProcesada = atencion.map((a) => {
        const codigoInfo = codigosDB.find((c) => c._id.toString() === a.codigo);

        if (!codigoInfo) {
          throw new Error(`Código no encontrado: ${a.codigo}`);
        }

        const valor = codigoInfo.price;
        const pagoDentista = Math.round(valor * 0.4); // Podés usar toFixed(2) si querés decimal
        return {
          codigo: a.codigo,
          valor,
          pagoDentista,
          observaciones: a.observaciones || "",
          pagado: "pendiente",
        };
      });

      const nuevoRegistro = new Registros({
        fechaAtencion,
        usuario: "6851f6f0d762b6ab7eca9601", // suponiendo que usás middleware auth
        paciente,
        atencion: atencionProcesada,
      });

      // Guardar en ambos modelos
      await nuevoRegistro.save();
      await Pacientes.updateOne({ _id: paciente }, { $push: { registros: nuevoRegistro._id } });

      res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
      console.error("Error al crear registro:", error);
      res.status(500).json({ message: "Error al crear registro" });
    }
  };
}
