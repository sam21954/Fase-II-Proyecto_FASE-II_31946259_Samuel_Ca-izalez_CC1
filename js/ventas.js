function dibujarVentas() {
  var html = "<table><tr><th>Fecha</th><th>Producto</th><th>Comprador</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>";
  var total = 0;
  var hay = false;
  for (var i = 0; i < compras.length; i++) {
    for (var j = 0; j < compras[i].items.length; j++) {
      var it = compras[i].items[j];
      if (it.vendedor == usuarioActual.nickname) {
        hay = true;
        total = total + it.precio * it.cantidad;
        html += "<tr><td>" + compras[i].fecha + "</td><td>" + limpiar(it.nombre) + "</td><td>@" + limpiar(compras[i].comprador) +
                "</td><td>" + it.cantidad + "</td><td>" + dinero(it.precio) + "</td><td>" + dinero(it.precio * it.cantidad) + "</td></tr>";
      }
    }
  }
  html += "</table><h3>Total vendido: " + dinero(total) + "</h3>";
  if (!hay) html = "<p>Todavía no tienes ventas.</p>";
  document.getElementById("tablaVentas").innerHTML = html;
}

if (exigirRol("vendedor")) {
  dibujarEncabezado("ventas.html", false);
  dibujarVentas();
}
