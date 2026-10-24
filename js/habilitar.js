function habilitarVenta() {
  var banco = document.getElementById("venderBanco").value.trim();
  var cuenta = document.getElementById("venderCuenta").value.replace(/ /g, "");
  var error = document.getElementById("errorVender");

  if (banco == "" || cuenta == "") {
    error.innerHTML = "Completa los datos bancarios.";
    return;
  }
  if (!cuentaValida(cuenta)) {
    error.innerHTML = "El número de cuenta debe tener entre 10 y 20 dígitos.";
    return;
  }

  usuarioActual.banco = banco;
  usuarioActual.cuenta = cuenta;
  usuarioActual.roles.push("vendedor");
  guardar();
  guardarSesion(usuarioActual.nickname, "vendedor");
  window.location.href = "vendedor.html";
}

if (exigirRol("comprador")) {
  dibujarEncabezado("habilitar.html", false);
  document.getElementById("venderBanco").value = usuarioActual.banco;
  document.getElementById("venderCuenta").value = usuarioActual.cuenta;
}
