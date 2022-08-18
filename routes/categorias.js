import { Router } from "express";
import { check } from "express-validator";
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers/index.js";
import { existeCategoriaPorId } from "../helpers/index.js";
import {
  esAdminRole,
  tieneRole,
  validarCampos,
  validarJWT,
} from "../middlewares/index.js";

const routerCat = Router();

// Obtener todas las categorias - publico
routerCat.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
routerCat.get(
  "/:id",
  [check("id").custom(existeCategoriaPorId), validarCampos],
  obtenerCategoria
);

// Crear categoria - privado - cualquier persona con un token valido
routerCat.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar categoria por id - privado - cualquier persona con un token valido
routerCat.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

// Borrar categoria por id - privado - Admin
routerCat.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

export { routerCat };
