import { Router } from "express";
import { body, param } from "express-validator";
import { CodigoController } from "../controllers/CodigoController";
import { handleImputErrors } from "../middleware/validation";
import { validateObraSocial } from "../middleware/obraSocial";

const route = Router();

route.get("/", CodigoController.getAllCodigos);

route.get(
  "/:idCodigo",
  param("idCodigo").isMongoId().withMessage("El ID del código es obligatorio y debe ser válido"),
  handleImputErrors,
  CodigoController.getCodigoById
);

route.post(
  "/:idObraSocial/create",
  param("idObraSocial").isMongoId().withMessage("El ID de la obra social es obligatorio y debe ser válido"),
  validateObraSocial,
  [
    body("code").notEmpty().withMessage("El código es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    body("validity").isDate().withMessage("La fecha de validez debe ser una fecha válida"),
    body("price").isFloat({ gt: 0 }).withMessage("El precio debe ser un número mayor que cero"),
  ],
  handleImputErrors,
  CodigoController.createCodigo
);

route.get(
  "/:idObraSocial/codes",
  param("idObraSocial").isMongoId().withMessage("El ID de la obra social es obligatorio y debe ser válido"),
  validateObraSocial,
  handleImputErrors,
  CodigoController.getCodigosByObraSocial
);

route.patch(
  "/:idCodigo/change-state",
  param("idCodigo").isMongoId().withMessage("El ID del código es obligatorio y debe ser válido"),
  handleImputErrors,
  CodigoController.changeStateCodigo
);

export default route;
