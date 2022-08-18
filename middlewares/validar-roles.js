import { request, response } from "express";

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin validar el token primero",
    });
  }
  const { rol, nombre } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `El usuario ${nombre} no es administrador - No puede hacer esto`,
    });
  }
  next();
};

const tieneRole =
  (...roles) =>
  (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin validar el token primero",
      });
    }
    const { rol, nombre } = req.usuario;
    if (!roles.includes(rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }
    next();
  };

export { esAdminRole, tieneRole };
