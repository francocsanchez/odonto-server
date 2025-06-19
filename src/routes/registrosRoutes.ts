import { Router } from "express";
import { body, param } from "express-validator";
import { handleImputErrors } from "../middleware/validation";
import { RegistroController } from "../controllers/RegistroController";
import { validatePaciente } from "../middleware/paciente";

const route = Router();

route.get("/", RegistroController.getAllRegistros);

route.param("idPaciente", validatePaciente);

route.post(
  "/:idPaciente/create",
  [
    body("fechaAtencion").isISO8601().withMessage("La fecha de atención debe ser una fecha válida"),
    body("paciente").isMongoId().withMessage("El ID de paciente debe ser válido"),
    body("atencion").isArray({ min: 1 }).withMessage("Debe haber al menos una atención"),
    body("atencion.*.codigo").isMongoId().withMessage("El código de atención no puede estar vacio"),
  ],
  handleImputErrors,
  RegistroController.crearRegistro
);

export default route;
