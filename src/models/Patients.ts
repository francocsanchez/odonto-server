import { Schema, model, Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  surname: string;
  dni: string;
  number_social: string;
}

const PatientSchema: Schema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    number_social: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default model<IPatient>("patients", PatientSchema);
