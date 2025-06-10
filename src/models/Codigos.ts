import { Schema, model, Document, Types } from "mongoose";

export interface ICodigo extends Document {
  description: string;
  code: string;
  validity: Date;
  price: number;
  enable: boolean;
  obraSocial: Types.ObjectId;
}
const CodigoSchema: Schema = new Schema<ICodigo>(
  {
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    validity: { type: Date, required: true },
    price: { type: Number, required: true },
    enable: { type: Boolean, required: true, default: true },
    obraSocial: { type: Schema.Types.ObjectId, ref: "obras_sociales", required: true },
  },
  {
    timestamps: true,
  }
);

export default model<ICodigo>("codigos", CodigoSchema);
