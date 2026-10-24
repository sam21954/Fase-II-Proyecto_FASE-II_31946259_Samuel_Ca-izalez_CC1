var itemsPago = [];
var totalPago = 0;
var modoPago = "";

function dibujarCatalogo() {
  var texto = document.getElementById("buscador").value.toLowerCase();
  var orden = document.getElementById("orden").value;

  var lista = [];
  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    var todo = (p.nombre + " " + p.descripcion + " " + p.vendedor).toLowerCase();
    if (todo.indexOf(texto) != -1) lista.push(p);
  }

  if (orden == "menor") lista.sort(function (a, b) { return a.precio - b.precio; });
  if (orden == "mayor") lista.sort(function (a, b) { return b.precio - a.precio; });
  if (orden == "nombre") lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
  if (orden == "nuevo") lista.sort(function (a, b) { return b.id - a.id; });

  var html = "";
  for (var j = 0; j < lista.length; j++) {
    var q = lista[j];
    html += '<div class="producto">';
    html += dibujarImagen(q);
    html += '<h3>' + limpiar(q.nombre) + '</h3>';
    html += '<p class="descripcion">' + limpiar(q.descripcion) + '</p>';
    html += '<p class="vendedor">Vendido por @' + limpiar(q.vendedor) + '</p>';
    html += '<p class="precio">' + dinero(q.precio) + '</p>';
    html += '<button onclick="anadirAlCarrito(' + q.id + ')">Añadir al carrito</button>';
    html += '<button class="azul" onclick="comprarYa(' + q.id + ')">Comprar de inmediato</button>';
    html += '</div>';
  }
  if (lista.length == 0) html = "<p>No se encontraron productos.</p>";
  document.getElementById("listaProductos").innerHTML = html;
}

function puedeComprar(producto) {
  if (producto != null && producto.vendedor == usuarioActual.nickname) {
    mensaje("No puedes comprar tu propio producto.");
    return false;
  }
  return true;
}


function anadirAlCarrito(id) {
  var p = buscarProducto(id);
  if (!puedeComprar(p)) return;

  var encontrado = false;
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      encontrado = true;
    }
  }
  if (!encontrado) carrito.push({ id: id, cantidad: 1 });

  guardarCarrito();
  actualizarCarrito();
  mensaje("Añadido: " + p.nombre);
}

function contarArticulos() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) total = total + carrito[i].cantidad;
  return total;
}

function totalCarrito() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    var p = buscarProducto(carrito[i].id);
    if (p != null) total = total + p.precio * carrito[i].cantidad;
  }
  return total;
}

function actualizarCarrito() {
  document.getElementById("contador").innerHTML = contarArticulos();
  if (document.getElementById("listaCarrito").className == "") dibujarListaCarrito();
}

function abrirCarrito() {
  var caja = document.getElementById("listaCarrito");
  if (caja.className == "oculto") {
    caja.className = "";
    dibujarListaCarrito();
  } else {
    caja.className = "oculto";
  }
}

function dibujarListaCarrito() {
  var vigentes = [];
  for (var k = 0; k < carrito.length; k++) {
    if (buscarProducto(carrito[k].id) != null) vigentes.push(carrito[k]);
  }
  carrito = vigentes;
  guardarCarrito();
  document.getElementById("contador").innerHTML = contarArticulos();

  var html = "<b>Tu carrito</b> (" + contarArticulos() + " artículos)<br><br>";
  if (carrito.length == 0) {
    html += "Está vacío. Añade productos desde el catálogo.";
  } else {
    for (var i = 0; i < carrito.length; i++) {
      var p = buscarProducto(carrito[i].id);
      html += '<div class="filaCarrito">';
      html += '<span>' + limpiar(p.nombre) + '<br><small>' + dinero(p.precio) + ' c/u</small></span>';
      html += '<span>';
      html += '<button onclick="cambiarCantidad(' + p.id + ', -1)">-</button> ';
      html += carrito[i].cantidad;
      html += ' <button onclick="cambiarCantidad(' + p.id + ', 1)">+</button>';
      html += '</span>';
      html += '<b>' + dinero(p.precio * carrito[i].cantidad) + '</b>';
      html += '</div>';
    }
    html += '<div class="totalGrande"><span>Total</span><span>' + dinero(totalCarrito()) + '</span></div>';
    html += '<button class="boton gris" onclick="vaciarCarrito()">Vaciar</button> ';
    html += '<button class="boton" onclick="comprarCarrito()">Comprar</button>';
  }
  document.getElementById("listaCarrito").innerHTML = html;
}

function cambiarCantidad(id, cambio) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].id == id) {
      carrito[i].cantidad = carrito[i].cantidad + cambio;
      if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
      break;
    }
  }
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}


function comprarYa(id) {
  var p = buscarProducto(id);
  if (!puedeComprar(p)) return;
  itemsPago = [{ id: id, cantidad: 1 }];
  modoPago = "ya";
  abrirVentanaPago();
}

function comprarCarrito() {
  if (carrito.length == 0) return;
  itemsPago = carrito;
  modoPago = "carrito";
  document.getElementById("listaCarrito").className = "oculto";
  abrirVentanaPago();
}

function abrirVentanaPago() {
  totalPago = 0;
  var html = "<h2>Procesar pago</h2><b>Resumen</b><br>";
  for (var i = 0; i < itemsPago.length; i++) {
    var p = buscarProducto(itemsPago[i].id);
    var sub = p.precio * itemsPago[i].cantidad;
    totalPago = totalPago + sub;
    html += itemsPago[i].cantidad + " x " + limpiar(p.nombre) + " — " + dinero(sub) + "<br>";
  }
  html += '<div class="totalGrande"><span>Total a pagar</span><span>' + dinero(totalPago) + '</span></div>';
  html += "<b>Datos bancarios</b><br>";
  html += 'Titular:<input type="text" id="pagoTitular" value="' + limpiar(usuarioActual.nombre + " " + usuarioActual.apellido) + '">';
  html += 'Banco:<input type="text" id="pagoBanco" value="' + limpiar(usuarioActual.banco) + '">';
  html += 'Número de cuenta:<input type="text" id="pagoCuenta" value="' + limpiar(usuarioActual.cuenta) + '">';
  html += '<small class="nota">Pasarela simulada: las cuentas que terminan en 0000 son rechazadas.</small>';
  html += '<p id="errorPago" class="error"></p>';
  html += '<button class="boton gris" onclick="cerrarVentanaPago()">Cancelar</button> ';
  html += '<button class="boton" id="btnPagar" onclick="procesarPago()">Pagar ' + dinero(totalPago) + '</button>';

  document.getElementById("ventanaPago").innerHTML = html;
  document.getElementById("fondoPago").className = "";
}

function cerrarVentanaPago() {
  document.getElementById("fondoPago").className = "oculto";
}

function pasarelaDePagos(cuenta) {
  if (!cuentaValida(cuenta)) {
    return { autorizado: false, motivo: "número de cuenta inválido" };
  }
  if (cuenta.slice(-4) == "0000") {
    return { autorizado: false, motivo: "fondos insuficientes" };
  }
  return { autorizado: true, motivo: "" };
}

function procesarPago() {
  var titular = document.getElementById("pagoTitular").value.trim();
  var banco = document.getElementById("pagoBanco").value.trim();
  var cuenta = document.getElementById("pagoCuenta").value.replace(/ /g, "");
  var error = document.getElementById("errorPago");

  if (titular == "" || banco == "" || cuenta == "") {
    error.innerHTML = "Completa los datos bancarios.";
    return;
  }

  var boton = document.getElementById("btnPagar");
  boton.disabled = true;
  boton.innerHTML = "Contactando con la pasarela...";
  error.innerHTML = "";

  setTimeout(function () {
    var respuesta = pasarelaDePagos(cuenta);

    if (respuesta.autorizado == false) {
      boton.disabled = false;
      boton.innerHTML = "Reintentar pago";
      error.innerHTML = "Pago rechazado: " + respuesta.motivo + ". No se registró la compra.";
      return;
    }

    var items = [];
    for (var i = 0; i < itemsPago.length; i++) {
      var p = buscarProducto(itemsPago[i].id);
      items.push({ nombre: p.nombre, precio: p.precio, cantidad: itemsPago[i].cantidad, vendedor: p.vendedor });
    }
    var compra = { id: siguienteIdCompra, fecha: fechaHoy(), comprador: usuarioActual.nickname, total: totalPago, items: items };
    siguienteIdCompra = siguienteIdCompra + 1;
    compras.push(compra);
    if (modoPago == "carrito") carrito = [];
    guardar();
    guardarCarrito();
    actualizarCarrito();

    mostrarRecibo(compra);
  }, 1000);
}

function mostrarRecibo(compra) {
  var html = '<h2>✅ Pago autorizado</h2>';
  html += "Compra número " + compra.id + "<br><br>";
  for (var i = 0; i < compra.items.length; i++) {
    html += compra.items[i].cantidad + " x " + limpiar(compra.items[i].nombre) + "<br>";
  }
  html += '<div class="totalGrande"><span>Total pagado</span><span>' + dinero(compra.total) + '</span></div>';
  html += '<button class="boton gris" onclick="cerrarVentanaPago()">Seguir comprando</button> ';
  html += '<button class="boton" onclick="window.location.href=\'compras.html\'">Ver mis compras</button>';
  document.getElementById("ventanaPago").innerHTML = html;
}


if (exigirRol("comprador")) {
  cargarCarrito();
  dibujarEncabezado("catalogo.html", true);
  actualizarCarrito();
  dibujarCatalogo();
}
