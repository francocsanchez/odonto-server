import { Request, Response } from "express";
import Codigo from "../models/Codigos";

export class CodigoController {
  static getAllCodigos = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigos = await Codigo.find();
      res.status(200).json(codigos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los codigos" });
    }
  };

  static createCodigo = async (req: Request, res: Response): Promise<void> => {
    const { codigo, descripcion, vigencia, cantidad, valor } = req.body;
    try {
      const newCodigo = new Codigo({
        codigo,
        descripcion,
        vigencia,
        cantidad,
        valor,
        subtotal: cantidad * valor,
      });
      await newCodigo.save();
      res.status(201).json(newCodigo);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el codigo" });
    }
  };

  static getCodigoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const codigo = await Codigo.findById(id);
      if (!codigo) {
        res.status(404).json({ message: "Codigo no encontrado" });
        return;
      }
      res.status(200).json(codigo);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el codigo" });
    }
  };

  static updateCodigo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { codigo, descripcion, vigencia, cantidad, valor } = req.body;
    try {
      const updatedCodigo = await Codigo.findByIdAndUpdate(
        id,
        {
          codigo,
          descripcion,
          vigencia,
          cantidad,
          valor,
          subtotal: cantidad * valor,
        },
        { new: true }
      );
      if (!updatedCodigo) {
        res.status(404).json({ message: "Codigo no encontrado" });
        return;
      }
      res.status(200).json(updatedCodigo);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el codigo" });
    }
  };

  static deleteCodigo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedCodigo = await Codigo.findByIdAndDelete(id);
      if (!deletedCodigo) {
        res.status(404).json({ message: "Codigo no encontrado" });
        return;
      }
      res.status(200).json({ message: "Codigo eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el codigo" });
    }
  };
  static enableCodigo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const codigo = await Codigo.findById(id);
      if (!codigo) {
        res.status(404).json({ message: "Codigo no encontrado" });
        return;
      }
      codigo.enable = !codigo.enable; // Toggle the enable status
      await codigo.save();
      res.status(200).json({ message: `Codigo ${codigo.enable ? "habilitado" : "deshabilitado"} exitosamente`, codigo });
    } catch (error) {
      res.status(500).json({ message: "Error al cambiar el estado del codigo" });
    }
  };
}
