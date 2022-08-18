import mongoose from "mongoose";
const { Schema, model } = mongoose;

const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});

const Role = model("Role", RoleSchema);
export { Role };
