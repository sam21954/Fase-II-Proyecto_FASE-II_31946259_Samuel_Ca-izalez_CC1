function dibujarCompras() {
  var html = "";
  for (var i = compras.length - 1; i >= 0; i--) {
    var c = compras[i];
    if (c.comprador == usuarioActual.nickname) {
      html += '<div class="compra"><b>Compra #' + c.id + '</b> — ' + c.fecha + '<br>';
      for (var j = 0; j < c.items.length; j++) {
        html += c.items[j].cantidad + " x " + limpiar(c.items[j].nombre) + " (" + dinero(c.items[j].precio) + ")<br>";
      }
      html += '<b>Total: ' + dinero(c.total) + '</b></div>';
    }
  }
  if (html == "") html = "<p>Todavía no has comprado nada.</p>";
  document.getElementById("listaCompras").innerHTML = html;
}

if (exigirRol("comprador")) {
  dibujarEncabezado("compras.html", false);
  dibujarCompras();
}
