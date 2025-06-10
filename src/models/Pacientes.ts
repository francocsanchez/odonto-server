import { Schema, model, Document } from "mongoose";

export interface IPaciente extends Document {
  fullName: string;
  dni: string;
  number_social: string;
}

const PacienteSchema: Schema = new Schema<IPaciente>(
  {
    fullName: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    number_social: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default model<IPaciente>("pacientes", PacienteSchema);
