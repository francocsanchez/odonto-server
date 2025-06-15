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
    body("usuario").isMongoId().withMessage("El ID de usuario debe ser válido"),
    body("paciente").isMongoId().withMessage("El ID de paciente debe ser válido"),
    body("atencion").isArray({ min: 1 }).withMessage("Debe haber al menos una atención"),
    body("atencion.*.codigo").isMongoId().withMessage("El código de atención debe ser un ID válido"),
    body("atencion.*.valor").isFloat({ gt: 0 }).withMessage("El valor debe ser un número mayor que cero"),
    body("atencion.*.pagoDentista").isFloat({ gt: 0 }).withMessage("El pago al dentista debe ser un número mayor que cero"),
    body("atencion.*.observaciones").optional().isString().withMessage("Las observaciones deben ser texto"),
  ],
  handleImputErrors,
  RegistroController.createRegistro
);

export default route;
