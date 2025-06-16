import { Schema, model, Document, Types, PopulatedDoc } from "mongoose";
import { ICodigo } from "./Codigos";
import { IPaciente } from "./Pacientes";
import { IUsuario } from "./Usuarios";

const registroEstado = {
  APROBADO: "aprobado",
  PENDIENTE: "pendiente",
  RECHAZADO: "rechazado",
} as const;

export type RegistroEstado = (typeof registroEstado)[keyof typeof registroEstado];

export interface IAtencion {
  codigo: PopulatedDoc<ICodigo & Document>;
  valor: number;
  pagoDentista: number;
  observaciones?: string;
  pagado: RegistroEstado;
}
export interface IRegistro extends Document {
  fechaAtencion: Date;
  usuario: PopulatedDoc<IUsuario & Document>;
  paciente: PopulatedDoc<IPaciente & Document>;
  atencion: IAtencion[];
}

const RegistroSchema: Schema = new Schema<IRegistro>(
  {
    fechaAtencion: { type: Date, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: "usuarios", required: true },
    paciente: { type: Schema.Types.ObjectId, ref: "pacientes", required: true },
    atencion: [
      {
        codigo: { type: Schema.Types.ObjectId, ref: "codigos", required: true },
        valor: { type: Number, required: true },
        pagoDentista: { type: Number, required: true },
        observaciones: { type: String, required: false },
        pagado: { type: String, enum: Object.values(registroEstado), default: registroEstado.PENDIENTE },
      },
    ],
  },
  {
    timestamps: true,
  }
);

RegistroSchema.index({ paciente: 1 });
RegistroSchema.index({ fechaAtencion: -1 });
RegistroSchema.index({ paciente: 1, fechaAtencion: -1 });

export default model<IRegistro>("registros", RegistroSchema);
