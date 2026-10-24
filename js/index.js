function iniciarSesion() {
  var nick = document.getElementById("loginNick").value.trim();
  var clave = document.getElementById("loginClave").value;
  var rol = document.getElementById("loginRol").value;
  var error = document.getElementById("errorLogin");

  var u = buscarUsuario(nick);
  if (u == null || u.clave != clave) {
    error.innerHTML = "Nickname o contraseña incorrectos.";
    return;
  }
  if (!tieneRol(u, rol)) {
    error.innerHTML = "Tu cuenta no tiene habilitado el rol " + rol + ". Roles disponibles: " + u.roles.join(", ") + ".";
    return;
  }

  guardarSesion(u.nickname, rol);
  window.location.href = paginaDeInicio(rol);
}

function registrarse() {
  var nombre = document.getElementById("regNombre").value.trim();
  var apellido = document.getElementById("regApellido").value.trim();
  var direccion = document.getElementById("regDireccion").value.trim();
  var nick = document.getElementById("regNick").value.trim();
  var clave = document.getElementById("regClave").value;
  var banco = document.getElementById("regBanco").value.trim();
  var cuenta = document.getElementById("regCuenta").value.replace(/ /g, "");
  var rol = document.getElementById("regRol").value;
  var error = document.getElementById("errorReg");

  if (nombre == "" || apellido == "" || direccion == "" || nick == "" || clave == "" || banco == "" || cuenta == "") {
    error.innerHTML = "Completa todos los campos.";
    return;
  }
  if (clave.length < 4) {
    error.innerHTML = "La contraseña debe tener al menos 4 caracteres.";
    return;
  }
  if (!cuentaValida(cuenta)) {
    error.innerHTML = "El número de cuenta debe tener entre 10 y 20 dígitos.";
    return;
  }
  if (buscarUsuario(nick) != null) {
    error.innerHTML = "Ese nickname ya existe. Elige otro.";
    return;
  }

  var nuevo = { nombre: nombre, apellido: apellido, direccion: direccion, nickname: nick, clave: clave,
                roles: [rol], banco: banco, cuenta: cuenta };
  usuarios.push(nuevo);
  guardar();

  error.innerHTML = "";
  document.getElementById("loginNick").value = nick;
  document.getElementById("loginRol").value = rol;
  document.getElementById("regClave").value = "";
  mensaje("Cuenta creada. Ahora inicia sesión.");
}

if (usuarioActual != null) {
  window.location.href = paginaDeInicio(rolActual);
}
