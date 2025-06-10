import { Router } from "express";
import { body, param } from "express-validator";
import { handleImputErrors } from "../middleware/validation";
import { UsuarioController } from "../controllers/UsuarioController";

const route = Router();

route.get("/", UsuarioController.getAllUsuarios);

route.post(
  "/",
  [
    body("name").notEmpty().withMessage("El campo name es requerido"),
    body("lastName").notEmpty().withMessage("El campo lastName es requerido"),
    body("email").notEmpty().withMessage("El campo email es requerido"),
    body("password").notEmpty().withMessage("El campo password es requerido"),
  ],
  handleImputErrors,
  UsuarioController.createUsuario
);

route.get("/:idUsuario", param("idUsuario").isMongoId().withMessage("El campo id es requerido"), handleImputErrors, UsuarioController.getUsuarioById);

route.put(
  "/:idUsuario",
  [
    param("idUsuario").isMongoId().withMessage("El campo id es requerido"),
    body("name").notEmpty().withMessage("El campo name es requerido"),
    body("lastName").notEmpty().withMessage("El campo lastName es requerido"),
    body("email").notEmpty().withMessage("El campo email es requerido"),
    body("password").notEmpty().withMessage("El campo password es requerido"),
  ],
  handleImputErrors,
  UsuarioController.updateUsuario
);

route.patch(
  "/:idUsuario/change-state",
  param("idUsuario").isMongoId().withMessage("El campo id es requerido"),
  handleImputErrors,
  UsuarioController.changeStateUsuario
);

export default route;
