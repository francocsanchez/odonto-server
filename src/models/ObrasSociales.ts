import { Schema, model, Document, PopulatedDoc } from "mongoose";
import { ICodigo } from "./Codigos";

export interface IObraSocial extends Document {
  name: string;
  codes: PopulatedDoc<ICodigo & Document>[];
  enable: boolean;
}

const ObraSocialSchema: Schema = new Schema<IObraSocial>(
  {
    name: { type: String, required: true, unique: true },
    codes: [{ type: Schema.Types.ObjectId, ref: "codigos" }],
    enable: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

export default model<IObraSocial>("obras_sociales", ObraSocialSchema);
