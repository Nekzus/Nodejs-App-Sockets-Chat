import { request, response } from "express";
import bcryptjs from "bcryptjs";
import { Usuario } from "../models/index.js";
import { generarJWT, googleVerify } from "../helpers/index.js";

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "El usuario/password no son correctos - email",
      });
    }

    // Verificar si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario/password no son correctos - estado: false",
      });
    }

    // Verificar si el password es correcto
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "El usuario/password no son correctos - password",
      });
    }

    // Crear el JWT
    const token = await generarJWT(usuario.id);
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salio mal",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, email, img } = await googleVerify(id_token);

    // Verificar si el email existe
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Si no existe, crear el usuario
      const data = {
        nombre,
        email,
        password: ":P",
        img,
        google: true,
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }
    // Crear el JWT
    const token = await generarJWT(usuario.id);
    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "El token no se pudo verificar",
    });
  }
};

export { login, googleSignIn };
