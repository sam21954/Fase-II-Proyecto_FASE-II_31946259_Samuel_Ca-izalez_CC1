function dibujarAdmin() {
  document.getElementById("resumenAdmin").innerHTML = "Hay " + (usuarios.length - 1) + " cuentas, " +
    productos.length + " productos publicados y " + compras.length + " compras.";

  var html = "<table><tr><th>Nickname</th><th>Nombre</th><th>Roles</th><th>Acción</th></tr>";
  for (var i = 0; i < usuarios.length; i++) {
    var u = usuarios[i];
    if (!tieneRol(u, "administrador")) {
      html += "<tr><td>@" + limpiar(u.nickname) + "</td><td>" + limpiar(u.nombre + " " + u.apellido) + "</td><td>";
      for (var r = 0; r < u.roles.length; r++) html += '<span class="etiqueta">' + u.roles[r] + '</span>';
      html += '</td><td><button onclick="eliminarUsuario(\'' + u.nickname + '\')">Eliminar cuenta</button></td></tr>';
    }
  }
  html += "</table>";
  document.getElementById("tablaUsuarios").innerHTML = html;

  html = "<table><tr><th>Producto</th><th>Vendedor</th><th>Precio</th><th>Acción</th></tr>";
  for (var j = 0; j < productos.length; j++) {
    var p = productos[j];
    html += "<tr><td>" + limpiar(p.nombre) + "</td><td>@" + limpiar(p.vendedor) + "</td><td>" + dinero(p.precio) + "</td>";
    html += '<td><button onclick="eliminarProducto(' + p.id + ')">Remover</button></td></tr>';
  }
  html += "</table>";
  document.getElementById("tablaProductos").innerHTML = html;
}

function eliminarUsuario(nick) {
  if (!confirm("¿Eliminar la cuenta de @" + nick + "? Sus productos dejarán de mostrarse en el catálogo.")) return;

  var usuariosRestantes = [];
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nickname != nick) usuariosRestantes.push(usuarios[i]);
  }
  usuarios = usuariosRestantes;

  var productosRestantes = [];
  for (var j = 0; j < productos.length; j++) {
    if (productos[j].vendedor != nick) productosRestantes.push(productos[j]);
  }
  productos = productosRestantes;

  guardar();
  dibujarAdmin();
  mensaje("Cuenta @" + nick + " eliminada");
}

function eliminarProducto(id) {
  var p = buscarProducto(id);
  if (!confirm("¿Remover «" + p.nombre + "» del catálogo?")) return;

  var restantes = [];
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id != id) restantes.push(productos[i]);
  }
  productos = restantes;
  guardar();
  dibujarAdmin();
  mensaje("Producto removido");
}

if (exigirRol("administrador")) {
  dibujarEncabezado("admin.html", false);
  dibujarAdmin();
}
