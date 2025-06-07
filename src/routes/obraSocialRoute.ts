import { Router } from "express";
import { body, param } from "express-validator";
import { handleImputErrors } from "../middleware/validation";
import { ObraSocialController } from "../controllers/ObraSocialController";

const route = Router();

route.get("/", ObraSocialController.getAllObrasSociales);
route.post(
  "/",
  body("name").notEmpty().withMessage("El nombre de la obra social es obligatorio"),
  handleImputErrors,
  ObraSocialController.createObraSocial
);
route.get("/:id", param("id").isMongoId().withMessage("ID de obra social inválido"), handleImputErrors, ObraSocialController.getObraSocialById);
route.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de obra social inválido"),
  body("name").notEmpty().withMessage("El nombre de la obra social es obligatorio"),
  handleImputErrors,
  ObraSocialController.updateObraSocial
);

export default route;
