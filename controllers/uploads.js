import { request, response } from "express";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL);
import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from "../models/index.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cargarArchivo = async (req = request, res = response) => {
  try {
    // txt , md
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res
          .status(400)
          .json({ msg: `No existe un producto con el id ${id}` });
      }
      break;
    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    return res.redirect(modelo.img);
  }

  const pathPlaceholder = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathPlaceholder);
};

export { cargarArchivo, mostrarImagen, actualizarImagenCloudinary };
