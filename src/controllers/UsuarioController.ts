import colors from "colors";
import { Request, Response } from "express";
import Usuarios from "../models/Usuarios";

export class UsuarioController {
  static getAllUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await Usuarios.find();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  };

  static createUsuario = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, lastName } = req.body;
    try {
      const usuario = await Usuarios.find({ email });
      if (usuario.length > 0) {
        res.status(400).json({ message: "El usuario ya existe" });
        return;
      }

      const newUsuario = new Usuarios({
        name,
        lastName,
        email,
        password,
      });
      await newUsuario.save();
      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al crear el usuario" });
    }
  };
  static getUsuarioById = async (req: Request, res: Response): Promise<void> => {
    const { idUsuario } = req.params;
    try {
      const usuario = await Usuarios.findById(idUsuario);
      if (!usuario) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json(usuario);
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };
  static updateUsuario = async (req: Request, res: Response): Promise<void> => {
    const { idUsuario } = req.params;
    const { email, password, name, lastName, enable } = req.body;
    try {
      const updatedUsuario = await Usuarios.findByIdAndUpdate(
        idUsuario,
        {
          name,
          lastName,
          email,
          password,
          enable,
        },
        { new: true }
      );
      if (!updatedUsuario) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  };

  static changeStateUsuario = async (req: Request, res: Response): Promise<void> => {
    const { idUsuario } = req.params;
    try {
      const usuario = await Usuarios.findById(idUsuario);
      if (!usuario) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      usuario.enable = !usuario.enable;
      await usuario.save();

      res.status(200).json({ message: `Estado de ${usuario.name} ${usuario.lastName} cambio a ${usuario.enable ? "habilitado" : "deshabilitado"}` });
    } catch (error) {
      console.error(colors.red(error.message));
      res.status(500).json({ message: "Error al obtener el estado del usuario" });
    }
  };
}
