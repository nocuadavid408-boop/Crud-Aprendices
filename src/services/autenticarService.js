const jwtoken = require("jsonwebtoken")
const ingresar = (usuario, clave) => {
    //valiar el usuario
      //simular bd
      const usuariobd={
        "usuario":"David",
        "clave":"abc123"
      }
     //validar datos del usuario
      if (usuario !== usuariobd.usuario || clave !== usuariobd.clave){
        return res.status(401).json({mensaje:"usuario y/o clave incorrecta."})
      }
      //crear token
      const token = jwtoken.sign(
      //pasamos datos del usaurio
      {user:usuario},
      process.env.JWT_SECRET,
      {expiresIn:"1h"}
      )
      return token

}

module.exports = ingresar