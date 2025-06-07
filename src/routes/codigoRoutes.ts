import { Router } from "express";
import { body, param } from "express-validator";
import { CodigoController } from "../controllers/CodigoController";
import { handleImputErrors } from "../middleware/validation";

const route = Router();

route.post(
  "/",
  body("codigo").notEmpty().withMessage("El campo codigo es requerido"),
  body("descripcion").notEmpty().withMessage("El campo descripcion es requerido"),
  body("vigencia").notEmpty().withMessage("El campo vigencia es requerido"),
  body("cantidad").notEmpty().withMessage("El campo cantidad es requerido"),
  body("valor").notEmpty().withMessage("El campo valor es requerido"),
  handleImputErrors,
  CodigoController.createCodigo
);
route.get("/", CodigoController.getAllCodigos);
route.get("/:id", param("id").isMongoId().withMessage("El campo id es requerido"), handleImputErrors, CodigoController.getCodigoById);
route.put(
  "/:id",
  param("id").isMongoId().withMessage("El campo id es requerido"),
  body("codigo").notEmpty().withMessage("El campo codigo es requerido"),
  body("descripcion").notEmpty().withMessage("El campo descripcion es requerido"),
  body("vigencia").notEmpty().withMessage("El campo vigencia es requerido"),
  body("cantidad").notEmpty().withMessage("El campo cantidad es requerido"),
  body("valor").notEmpty().withMessage("El campo valor es requerido"),
  handleImputErrors,
  CodigoController.updateCodigo
);
route.delete("/:id", param("id").isMongoId().withMessage("El campo id es requerido"), handleImputErrors, CodigoController.deleteCodigo);
route.patch("/:id/enable", param("id").isMongoId().withMessage("El campo id es requerido"), handleImputErrors, CodigoController.enableCodigo);

export default route;
