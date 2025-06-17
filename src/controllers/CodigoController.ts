import colors from "colors";
import { Request, Response } from "express";
import { Codigos, ObrasSociales } from "../models";

import * as XLSX from "xlsx";
import { parseExcelDate } from "../helpers";
import mongoose from "mongoose";

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

  static importarCodigos = async (req: Request, res: Response): Promise<void> => {
    try {
      const archivo = req.file;
      const { obraSocialId } = req.body;

      const os = await ObrasSociales.findById(obraSocialId);
      if (!os) {
        res.status(404).json({ message: "Obra social no encontrada" });
        return;
      }

      if (!archivo || !archivo.buffer) {
        res.status(400).json({ message: "Archivo no recibido correctamente" });
        return;
      }

      const workbook = XLSX.read(archivo.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      interface CodigoImportado {
        obraSocial: string;
        code: string;
        description: string;
        validity: string | Date;
        price: number;
      }

      const data = XLSX.utils.sheet_to_json<CodigoImportado>(worksheet);

      const columnasEsperadas = ["code", "description", "validity", "price"];
      const tieneTodasLasColumnas = columnasEsperadas.every((col) => Object.keys(data[0] || {}).includes(col));

      if (!tieneTodasLasColumnas) {
        res.status(400).json({
          message: "Faltan columnas requeridas: code, description, validity, price",
        });
        return;
      }

      let creados = 0;
      let actualizados = 0;
      let errores = 0;

      for (const fila of data) {
        try {
          const { code, description, validity, price } = fila;

          const codeOriginal = code.toString().trim().toUpperCase(); // Normalización mínima

          const codigoExistente = await Codigos.findOne({
            code: codeOriginal,
            obraSocial: new mongoose.Types.ObjectId(obraSocialId),
          });

          if (codigoExistente) {
            codigoExistente.description = description;
            codigoExistente.validity = parseExcelDate(validity);
            codigoExistente.price = price;
            await codigoExistente.save();
            actualizados++;
          } else {
            console.log(`No existe el código ${codeOriginal} para OS ${obraSocialId}, se procede a crear`);
            const nuevoCodigo = new Codigos({
              code: codeOriginal,
              description,
              validity: parseExcelDate(validity),
              price,
              obraSocial: new mongoose.Types.ObjectId(obraSocialId),
            });

            await nuevoCodigo.save();
            await ObrasSociales.updateOne({ _id: obraSocialId }, { $push: { codes: nuevoCodigo._id } });
            // await Promise.allSettled([nuevoCodigo.save(), os.save()]);

            creados++;
          }
        } catch (error) {}
      }

      res.status(200).json({
        message: "Importación finalizada",
        resumen: {
          total: data.length,
          creados,
          actualizados,
          errores,
        },
      });
    } catch (error) {
      console.error("Error general al importar códigos:", error);
      res.status(500).json({ message: "Error al importar códigos" });
    }
  };
}
