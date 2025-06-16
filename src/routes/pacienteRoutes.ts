import { Router } from "express";
import { body, param } from "express-validator";
import { handleImputErrors } from "../middleware/validation";
import { PacienteController } from "../controllers/PacienteController";

const route = Router();

route.get("/", PacienteController.getAllPacientes);

route.post(
  "/",
  [
    body("fullName").notEmpty().withMessage("El nombre completo es obligatorio"),
    body("dni").notEmpty().withMessage("El DNI es obligatorio"),
    body("number_social").notEmpty().withMessage("El número de seguro social es obligatorio"),
    handleImputErrors,
  ],
  PacienteController.createPaciente
);

route.get(
  "/:idPaciente",
  [param("idPaciente").isMongoId().withMessage("ID de paciente inválido"), handleImputErrors],
  PacienteController.getPacienteById
);

route.put(
  "/:idPaciente",
  [
    param("idPaciente").isMongoId().withMessage("ID de paciente inválido"),
    body("fullName").optional().notEmpty().withMessage("El nombre completo es obligatorio"),
    body("dni").optional().notEmpty().withMessage("El DNI es obligatorio"),
    body("number_social").optional().notEmpty().withMessage("El número de seguro social es obligatorio"),
    handleImputErrors,
  ],
  PacienteController.updatePaciente
);

route.get("/:idPaciente/registros", PacienteController.getAllRegistrosByPacienteID);
route.get(
  "/:idPaciente/registros/:estado",
  [
    param("idPaciente").isMongoId().withMessage("ID de paciente inválido"),
    param("estado").isIn(["aprobado", "pendiente", "rechazado"]).withMessage("El estado debe ser 'aprobado', 'pendiente' o 'rechazado'"),
    handleImputErrors,
  ],
  PacienteController.getAllRegistrosByPacienteIDWithEstado
);
export default route;
