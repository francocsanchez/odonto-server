import { Request, Response } from "express";
import { Registros, Pacientes } from "../models";

export class PacienteController {
  static getAllPacientes = async (req: Request, res: Response): Promise<void> => {
    try {
      const pacientes = await Pacientes.find().populate("obraSocial", "name");
      res.status(200).json(pacientes);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error al obtener los pacientes" });
    }
  };

  static createPaciente = async (req: Request, res: Response): Promise<void> => {
    const { fullName, dni, number_social, obraSocial } = req.body;

    const paciente = await Pacientes.find({ dni });
    if (paciente.length > 0) {
      res.status(400).json({ message: "El paciente ya existe" });
      return;
    }

    try {
      const newPaciente = new Pacientes({
        fullName,
        dni,
        number_social,
        obraSocial,
      });

      await newPaciente.save();
      res.status(201).json({ message: "Paciente creado exitosamente" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error al crear el paciente" });
    }
  };

  static getPacienteById = async (req: Request, res: Response): Promise<void> => {
    const { idPaciente } = req.params;

    try {
      const paciente = await Pacientes.findById(idPaciente).populate("obraSocial", "name");
      if (!paciente) {
        res.status(404).json({ message: "Paciente no encontrado" });
        return;
      }
      res.status(200).json(paciente);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error al obtener el paciente" });
    }
  };

  static updatePaciente = async (req: Request, res: Response): Promise<void> => {
    const { idPaciente } = req.params;
    const { fullName, dni, number_social, obraSocial } = req.body;

    try {
      const paciente = await Pacientes.findById(idPaciente);
      if (!paciente) {
        res.status(404).json({ message: "Paciente no encontrado" });
        return;
      }

      if (dni && paciente.dni !== dni) {
        const existingPaciente = await Pacientes.findOne({ dni });
        if (existingPaciente) {
          res.status(400).json({ message: "El DNI ya está en uso por otro paciente" });
          return;
        }
      }

      await Pacientes.findByIdAndUpdate(
        idPaciente,
        {
          fullName,
          dni,
          number_social,
          obraSocial,
        },
        { new: true }
      );

      res.status(200).json({ message: "Paciente actualizado exitosamente" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error al actualizar el paciente" });
    }
  };

  static getAllRegistrosByPacienteID = async (req: Request, res: Response): Promise<void> => {
    const { idPaciente } = req.params;

    try {
      const paciente = await Pacientes.findById(idPaciente);
      if (!paciente) {
        res.status(404).json({ message: "Paciente no encontrado" });
        return;
      }

      const registros = await Registros.find({ paciente: idPaciente })
        .sort({ fechaAtencion: -1 })
        .populate("usuario", "name lastName")
        .populate("atencion.codigo", "description");

      res.status(200).json(registros);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los registros del paciente" });
    }
  };

  static getAllRegistrosByPacienteIDWithEstado = async (req: Request, res: Response): Promise<void> => {
    const { idPaciente, estado } = req.params;

    try {
      const paciente = await Pacientes.findById(idPaciente);
      if (!paciente) {
        res.status(404).json({ message: "Paciente no encontrado" });
        return;
      }

      const registros = await Registros.find({
        paciente: idPaciente,
        atencion: {
          $elemMatch: {
            pagado: estado,
          },
        },
      })
        .sort({ fechaAtencion: -1 })
        .populate("usuario", "name lastName")
        .populate("atencion.codigo", "description");

      res.status(200).json(registros);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los registros del paciente" });
    }
  };
}
