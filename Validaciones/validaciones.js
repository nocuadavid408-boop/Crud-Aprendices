
function validarNombre(nombre) {
  return typeof nombre === 'string' && nombre.trim().length > 2;
}

function validarCorreo(correo) {
  const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexCorreo.test(correo);
}

module.exports = {
  validarNombre,
  validarCorreo
};