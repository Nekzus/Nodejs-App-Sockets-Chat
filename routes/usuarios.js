import { Router } from "express";
import { check } from "express-validator";
import {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} from "../middlewares/index.js";
import {
  emailExiste,
  esRolValido,
  existeUsuarioPorId,
} from "../helpers/index.js";
import {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} from "../controllers/index.js";

const routerUser = Router();

routerUser.get("/", usuariosGet);
routerUser.put(
  "/:id",
  [
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);
routerUser.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo no es válido").isEmail(),
    check("email").custom(emailExiste),
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    // check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRolValido),
    validarCampos,
  ],

  usuariosPost
);
routerUser.patch("/", usuariosPatch);
routerUser.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

export { routerUser };
