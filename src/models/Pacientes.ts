import { Schema, model, Document, PopulatedDoc } from "mongoose";
import { IRegistro } from "./Registros";

export interface IPaciente extends Document {
  fullName: string;
  dni: string;
  number_social: string;
  registros: PopulatedDoc<IRegistro & Document>[];
}

const PacienteSchema: Schema = new Schema<IPaciente>(
  {
    fullName: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    number_social: { type: String, required: true, unique: true },
    registros: [{ type: Schema.Types.ObjectId, ref: "registros" }],
  },
  {
    timestamps: true,
  }
);

export default model<IPaciente>("pacientes", PacienteSchema);
