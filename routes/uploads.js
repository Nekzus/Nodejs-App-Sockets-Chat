import { Router } from "express";
import { check } from "express-validator";
import {
  actualizarImagenCloudinary,
  cargarArchivo,
  mostrarImagen,
} from "../controllers/index.js";
import { coleccionesPermitidas, existeArchivoPorId } from "../helpers/index.js";
import { validarArchivoSubir, validarCampos } from "../middlewares/index.js";

const routerUp = Router();

routerUp.post("/", validarArchivoSubir, cargarArchivo);

routerUp.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id es obligatorio").custom(existeArchivoPorId),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  actualizarImagenCloudinary
);

routerUp.get(
  "/:coleccion/:id",
  [
    check("id", "El id es obligatorio").custom(existeArchivoPorId),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

export { routerUp };
