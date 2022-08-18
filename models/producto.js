import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: { type: Boolean, default: true, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  precio: { type: Number, default: 0 },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true },
  img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...producto } = this.toObject();

  if (producto.usuario._id) {
    producto.usuario.uid = producto.usuario._id;
    delete producto.usuario._id;
  }

  return producto;
};

const Producto = model("Producto", ProductoSchema);

export { Producto };
