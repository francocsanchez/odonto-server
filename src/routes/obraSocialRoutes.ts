import { Router } from "express";
import { body, param } from "express-validator";
import { handleImputErrors } from "../middleware/validation";
import { ObraSocialController } from "../controllers/ObraSocialController";

const route = Router();

route.get("/", ObraSocialController.getAllObrasSocialesActives);
route.get("/totals", ObraSocialController.getAllObrasSociales);

route.post(
  "/",
  body("name").notEmpty().withMessage("El nombre de la obra social es obligatorio"),
  handleImputErrors,
  ObraSocialController.createObraSocial
);

route.get(
  "/:idObraSocial",
  param("idObraSocial").isMongoId().withMessage("ID de obra social inválido"),
  handleImputErrors,
  ObraSocialController.getObraSocialById
);

route.put(
  "/:idObraSocial",
  [
    param("idObraSocial").isMongoId().withMessage("ID de obra social inválido"),
    body("name").notEmpty().withMessage("El nombre de la obra social es obligatorio"),
  ],
  handleImputErrors,
  ObraSocialController.updateObraSocial
);

route.patch(
  "/:idObraSocial/change-state",
  param("idObraSocial").isMongoId().withMessage("ID de obra social inválido"),
  handleImputErrors,
  ObraSocialController.changeStateObraSocial
);

export default route;
