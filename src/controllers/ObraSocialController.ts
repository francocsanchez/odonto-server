import colors from "colors";
import { Request, Response } from "express";
import ObrasSociales from "../models/ObrasSociales";

export class ObraSocialController {
  static getAllObrasSocialesActives = async (req: Request, res: Response): Promise<void> => {
    try {
      const obrasSociales = await ObrasSociales.find({ enable: true }).populate("codes").sort({ name: 1 });
      res.status(200).json(obrasSociales);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener las obras sociales" });
    }
  };

  static getAllObrasSociales = async (req: Request, res: Response): Promise<void> => {
    try {
      const obrasSociales = await ObrasSociales.find().populate("codes").sort({ name: 1 });
      res.status(200).json(obrasSociales);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener las obras sociales" });
    }
  };

  static createObraSocial = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    try {
      const obraSocial = await ObrasSociales.find({ name });
      if (obraSocial.length > 0) {
        res.status(400).json({ message: "La obra social ya existe" });
        return;
      }
      const newObraSocial = new ObrasSociales({ name });
      await newObraSocial.save();
      res.status(201).json({ message: "Obra social creada exitosamente" });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al crear la obra social" });
    }
  };

  static getObraSocialById = async (req: Request, res: Response): Promise<void> => {
    const { idObraSocial } = req.params;
    try {
      const obraSocial = await ObrasSociales.findById(idObraSocial).populate("codes");
      if (!obraSocial) {
        res.status(404).json({ message: "Obra social no encontrada" });
        return;
      }
      res.status(200).json(obraSocial);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener la obra social" });
    }
  };

  static updateObraSocial = async (req: Request, res: Response): Promise<void> => {
    const { idObraSocial } = req.params;
    const { name } = req.body;
    try {
      const updatedObraSocial = await ObrasSociales.findByIdAndUpdate(idObraSocial, { name }, { new: true });
      if (!updatedObraSocial) {
        res.status(404).json({ message: "Obra social no encontrada" });
        return;
      }
      res.status(200).json({ message: "Obra social actualizada correctamente" });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al actualizar la obra social" });
    }
  };

  static changeStateObraSocial = async (req: Request, res: Response): Promise<void> => {
    const { idObraSocial } = req.params;
    try {
      const obraSocial = await ObrasSociales.findById(idObraSocial);
      if (!obraSocial) {
        res.status(404).json({ message: "Obra social no encontrada" });
        return;
      }
      obraSocial.enable = !obraSocial.enable;
      await obraSocial.save();
      res.status(200).json({
        message: `Obra social ${obraSocial.name} ${obraSocial.enable ? "habilitada" : "deshabilitada"} exitosamente`,
      });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al cambiar el estado de la obra social" });
    }
  };
}
