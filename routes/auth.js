import { Router } from "express";
import { check } from "express-validator";
import { googleSignIn, login, renovarToken } from "../controllers/index.js";
import { validarCampos, validarJWT } from "../middlewares/index.js";

const routerAuth = Router();

routerAuth.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

routerAuth.post(
  "/google",
  [check("id_token", "id_token es necesario").not().isEmpty(), validarCampos],
  googleSignIn
);

routerAuth.get("/", validarJWT, renovarToken);

export { routerAuth };
