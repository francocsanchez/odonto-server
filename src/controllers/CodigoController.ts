import colors from "colors";
import { Request, Response } from "express";
import { Codigos } from "../models";

export class CodigoController {
  static getAllCodigos = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigos = await Codigos.find().populate("obraSocial");
      res.status(200).json(codigos);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener los códigos" });
    }
  };

  static createCodigo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, description, validity, price } = req.body;
      const codeExists = await Codigos.findOne({ code, obraSocial: req.obraSocial.id });

      if (codeExists) {
        const error = new Error("El código ya existe para esta obra social");
        res.status(400).json(error.message);
        return;
      }

      const newCodigo = new Codigos({ code, description, validity, price, obraSocial: req.obraSocial.id });

      req.obraSocial.codes.push(newCodigo.id);

      await Promise.allSettled([newCodigo.save(), req.obraSocial.save()]);

      res.status(201).json("Código creado exitosamente");
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al crear el código" });
    }
  };

  static changeStateCodigo = async (req: Request, res: Response): Promise<void> => {
    const { idCodigo } = req.params;
    try {
      const codigo = await Codigos.findById(idCodigo);
      if (!codigo) {
        res.status(404).json({ message: "Código no encontrado" });
        return;
      }

      codigo.enable = !codigo.enable;

      await codigo.save();

      res.status(200).json({
        message: `El codigo ${codigo.code} se encuentra ${codigo.enable ? "habilitado" : "deshabilitado"} exitosamente`,
      });

      res.status(200).json({ message: "Estado del código actualizado", codigo });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al cambiar el estado del código" });
    }
  };

  static getCodigoById = async (req: Request, res: Response): Promise<void> => {
    const { idCodigo } = req.params;
    try {
      const codigo = await Codigos.findById(idCodigo).populate("obraSocial");
      if (!codigo) {
        res.status(404).json({ message: "Código no encontrado" });
        return;
      }
      res.status(200).json(codigo);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener el código" });
    }
  };

  static getCodigosByObraSocial = async (req: Request, res: Response): Promise<void> => {
    const { idObraSocial } = req.params;
    try {
      const codigos = await Codigos.find({ obraSocial: idObraSocial }).populate("obraSocial");
      if (codigos.length === 0) {
        res.status(404).json({ message: "No se encontraron códigos para esta obra social" });
        return;
      }
      res.status(200).json(codigos);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener los códigos de la obra social" });
    }
  };
}
