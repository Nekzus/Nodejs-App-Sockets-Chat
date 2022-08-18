import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UsuarioSchema = Schema({
  nombre: { type: String, required: [true, "El nombre es obligatorio"] },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: { type: String, required: [true, "La contraseña es obligatoria"] },
  img: { type: String },
  rol: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: ["ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"],
  },
  estado: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  const uid = _id;
  return { uid, ...usuario };
};

const Usuario = model("Usuario", UsuarioSchema);

export { Usuario };
