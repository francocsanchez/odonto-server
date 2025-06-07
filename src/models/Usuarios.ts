import { Schema, model, Document } from "mongoose";

export interface IUsuario extends Document {
  email: string;
  name: string;
  lastName: string;
  password: string;
  enable: boolean;
}

const UsuarioSchema: Schema = new Schema<IUsuario>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enable: { type: Boolean, required: true, default: true },
});

export default model<IUsuario>("usuarios", UsuarioSchema);
