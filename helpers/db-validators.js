import mongoose from "mongoose";
import { Categoria, Producto, Role, Usuario } from "../models/index.js";

const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no existe en la BD`);
  }
};

const emailExiste = async (email = "") => {
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    throw new Error(`El email: ${email}, ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const existId = await Usuario.findById(id);
    if (!existId) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id} no es válido`);
  }
};

const existeCategoriaPorId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const existId = await Categoria.findById(id);
    if (!existId) {
      throw new Error(`La categoria ${id}, no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id}, no es un id de Mongo válido`);
  }
};

const existeProductoPorId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const existId = await Producto.findById(id);
    if (!existId) {
      throw new Error(`El producto ${id}, no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id}, no es un id de Mongo válido`);
  }
};

const existeArchivoPorId = async (id) => {
  const validId = mongoose.Types.ObjectId.isValid(id);
  if (!validId) {
    throw new Error(`El id ${id}, no es un id de Mongo válido`);
  } else {
    return true;
  }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La colección ${coleccion} no es permitida - ${colecciones}`
    );
  } else {
    return true;
  }
};

export {
  coleccionesPermitidas,
  emailExiste,
  esRolValido,
  existeArchivoPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  existeUsuarioPorId,
};
