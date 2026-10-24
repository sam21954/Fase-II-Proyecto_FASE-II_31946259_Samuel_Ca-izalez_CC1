var usuarios = [
  { nombre: "Admin", apellido: "BinaryShop", direccion: "Sede central", nickname: "admin", clave: "admin",
    roles: ["administrador"], banco: "", cuenta: "" },
  { nombre: "Ana", apellido: "Rojas", direccion: "Caracas", nickname: "ana", clave: "1234",
    roles: ["comprador"], banco: "Banesco", cuenta: "01340000111122223333" },
  { nombre: "Luis", apellido: "Pérez", direccion: "Valencia", nickname: "luis", clave: "1234",
    roles: ["vendedor"], banco: "Mercantil", cuenta: "01050000444455556666" },
  { nombre: "María", apellido: "Gómez", direccion: "Maracay", nickname: "maria", clave: "1234",
    roles: ["comprador", "vendedor"], banco: "Provincial", cuenta: "01080000777788889999" },
  { nombre: "Pedro", apellido: "Salas", direccion: "Barquisimeto", nickname: "pedro", clave: "1234",
    roles: ["comprador"], banco: "Banco de Venezuela", cuenta: "01020000123412340000" }
];

var productos = [
  { id: 1, nombre: "Teclado mecánico", descripcion: "Switches rojos y luz RGB.", precio: 49.9, imagen: "⌨️", vendedor: "luis" },
  { id: 2, nombre: "Auriculares inalámbricos", descripcion: "Bluetooth, 30 horas de batería.", precio: 34.5, imagen: "🎧", vendedor: "luis" },
  { id: 3, nombre: "Mouse ergonómico", descripcion: "Vertical, 4 botones.", precio: 22, imagen: "🖱️", vendedor: "luis" },
  { id: 4, nombre: "Monitor 24 pulgadas", descripcion: "Full HD, panel IPS.", precio: 129, imagen: "🖥️", vendedor: "maria" },
  { id: 5, nombre: "Webcam 1080p", descripcion: "Con micrófono integrado.", precio: 27.8, imagen: "📷", vendedor: "maria" },
  { id: 6, nombre: "Memoria USB 128 GB", descripcion: "USB 3.2, metálica.", precio: 11.99, imagen: "💾", vendedor: "maria" }
];

var compras = [
  { id: 1, fecha: "12/10/2026", comprador: "ana", total: 71.9,
    items: [ { nombre: "Teclado mecánico", precio: 49.9, cantidad: 1, vendedor: "luis" },
             { nombre: "Mouse ergonómico", precio: 22, cantidad: 1, vendedor: "luis" } ] }
];

var siguienteIdProducto = 7;
var siguienteIdCompra = 2;


function guardar() {
  var datos = { usuarios: usuarios, productos: productos, compras: compras,
                siguienteIdProducto: siguienteIdProducto, siguienteIdCompra: siguienteIdCompra };
  try {
    localStorage.setItem("binaryshop2", JSON.stringify(datos));
  } catch (e) {
    mensaje("No se pudo guardar (almacenamiento lleno).");
  }
}

function cargar() {
  var texto = localStorage.getItem("binaryshop2");
  if (texto != null) {
    var datos = JSON.parse(texto);
    usuarios = datos.usuarios;
    productos = datos.productos;
    compras = datos.compras;
    siguienteIdProducto = datos.siguienteIdProducto;
    siguienteIdCompra = datos.siguienteIdCompra;
  }
}


var usuarioActual = null;
var rolActual = "";

function cargarSesion() {
  var texto = localStorage.getItem("sesionBinaryShop");
  if (texto != null) {
    var sesion = JSON.parse(texto);
    usuarioActual = buscarUsuario(sesion.nickname);
    rolActual = sesion.rol;
  }
}

function guardarSesion(nickname, rol) {
  localStorage.setItem("sesionBinaryShop", JSON.stringify({ nickname: nickname, rol: rol }));
}

function cerrarSesion() {
  localStorage.removeItem("sesionBinaryShop");
  window.location.href = "index.html";
}

function paginaDeInicio(rol) {
  if (rol == "vendedor") return "vendedor.html";
  if (rol == "administrador") return "admin.html";
  return "catalogo.html";
}

function exigirRol(rol) {
  if (usuarioActual == null || rolActual != rol) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function cambiarRol(nuevoRol) {
  guardarSesion(usuarioActual.nickname, nuevoRol);
  window.location.href = paginaDeInicio(nuevoRol);
}


var carrito = [];

function cargarCarrito() {
  var texto = localStorage.getItem("carrito_" + usuarioActual.nickname);
  if (texto != null) carrito = JSON.parse(texto);
}

function guardarCarrito() {
  localStorage.setItem("carrito_" + usuarioActual.nickname, JSON.stringify(carrito));
}


function mensaje(texto) {
  var caja = document.getElementById("mensaje");
  if (caja == null) {
    caja = document.createElement("div");
    caja.id = "mensaje";
    document.body.appendChild(caja);
  }
  caja.innerHTML = texto;
  caja.className = "";
  setTimeout(function () { caja.className = "oculto"; }, 3000);
}

function limpiar(texto) {
  return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dinero(numero) {
  return "$" + numero.toFixed(2);
}

function fechaHoy() {
  var f = new Date();
  return f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
}

function buscarProducto(id) {
  for (var i = 0; i < productos.length; i++) {
    if (productos[i].id == id) return productos[i];
  }
  return null;
}

function buscarUsuario(nick) {
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nickname == nick) return usuarios[i];
  }
  return null;
}

function tieneRol(usuario, rol) {
  return usuario.roles.indexOf(rol) != -1;
}

function cuentaValida(cuenta) {
  if (cuenta.length < 10 || cuenta.length > 20) return false;
  for (var i = 0; i < cuenta.length; i++) {
    if (cuenta[i] < "0" || cuenta[i] > "9") return false;
  }
  return true;
}

function dibujarImagen(p) {
  if (p.imagen.indexOf("data:") == 0) {
    return '<img src="' + p.imagen + '" alt="' + limpiar(p.nombre) + '">';
  }
  return '<div class="emoji">' + p.imagen + '</div>';
}


function enlace(archivo, texto, activa) {
  var clase = (archivo == activa) ? ' class="activa"' : '';
  return '<a href="' + archivo + '"' + clase + '>' + texto + '</a>';
}

function dibujarEncabezado(activa, conCarrito) {
  var html = '<div class="barra-superior">';
  html += '<a class="logo" href="' + paginaDeInicio(rolActual) + '"><span>01</span>BinaryShop</a>';
  html += '<nav>';

  if (rolActual == "comprador") {
    html += enlace("catalogo.html", "Catálogo", activa);
    html += enlace("compras.html", "Mis compras", activa);
    if (!tieneRol(usuarioActual, "vendedor")) {
      html += enlace("habilitar.html", "Quiero vender", activa);
    }
  }
  if (rolActual == "vendedor") {
    html += enlace("vendedor.html", "Mis productos", activa);
    html += enlace("ventas.html", "Historial de ventas", activa);
  }
  if (rolActual == "administrador") {
    html += enlace("admin.html", "Panel de administrador", activa);
  }

  if (rolActual != "administrador") {
    var otro = (rolActual == "comprador") ? "vendedor" : "comprador";
    if (tieneRol(usuarioActual, otro)) {
      html += '<button onclick="cambiarRol(\'' + otro + '\')">Cambiar a ' + otro + '</button>';
    }
  }

  html += '<span class="usuario">@' + limpiar(usuarioActual.nickname) + ' (' + rolActual + ')</span>';

  if (conCarrito) {
    html += '<span id="zonaCarrito">';
    html += '<button onclick="abrirCarrito()">🛒 Carrito <span id="contador">0</span></button>';
    html += '<div id="listaCarrito" class="oculto"></div>';
    html += '</span>';
  }

  html += '<button onclick="cerrarSesion()">Cerrar sesión</button>';
  html += '</nav></div>';
  document.getElementById("encabezado").innerHTML = html;
}


cargar();
cargarSesion();
