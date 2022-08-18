import { request, response } from "express";
import { Categoria } from "../models/index.js";

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json(categoria);
};

// crearCategoria
const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  try {
    // Crear data a guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
    };
    // Guardar en la base de datos
    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  });
  res.json(categoria);
};

// borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoriaDB = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(categoriaDB);
};

export {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
};
