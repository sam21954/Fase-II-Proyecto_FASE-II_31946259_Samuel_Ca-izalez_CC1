function publicarProducto() {
  var nombre = document.getElementById("prodNombre").value.trim();
  var descripcion = document.getElementById("prodDescripcion").value.trim();
  var precio = parseFloat(document.getElementById("prodPrecio").value);
  var archivo = document.getElementById("prodImagen").files[0];
  var error = document.getElementById("errorProd");

  if (nombre.length < 3) { error.innerHTML = "El nombre debe tener al menos 3 letras."; return; }
  if (isNaN(precio) || precio <= 0) { error.innerHTML = "El precio debe ser un número mayor que 0."; return; }
  if (archivo == undefined) { error.innerHTML = "Debes elegir una imagen."; return; }
  if (archivo.type.indexOf("image") != 0) { error.innerHTML = "El archivo debe ser una imagen."; return; }

  var lector = new FileReader();
  lector.onload = function () {
    var imagen = new Image();
    imagen.onload = function () {
      var ancho = 500;
      var alto = Math.round(imagen.height * ancho / imagen.width);
      var lienzo = document.createElement("canvas");
      lienzo.width = ancho;
      lienzo.height = alto;
      lienzo.getContext("2d").drawImage(imagen, 0, 0, ancho, alto);

      var nuevo = { id: siguienteIdProducto, nombre: nombre, descripcion: descripcion, precio: precio,
                    imagen: lienzo.toDataURL("image/jpeg", 0.8), vendedor: usuarioActual.nickname };
      siguienteIdProducto = siguienteIdProducto + 1;
      productos.push(nuevo);
      guardar();

      error.innerHTML = "";
      document.getElementById("prodNombre").value = "";
      document.getElementById("prodDescripcion").value = "";
      document.getElementById("prodPrecio").value = "";
      document.getElementById("prodImagen").value = "";
      mensaje("Producto publicado: " + nombre);
      dibujarMisProductos();
    };
    imagen.src = lector.result;
  };
  lector.readAsDataURL(archivo);
}

function dibujarMisProductos() {
  var html = "<table><tr><th>Producto</th><th>Precio</th><th>Acción</th></tr>";
  var hay = false;
  for (var i = 0; i < productos.length; i++) {
    var p = productos[i];
    if (p.vendedor == usuarioActual.nickname) {
      hay = true;
      html += "<tr><td>" + limpiar(p.nombre) + "</td><td>" + dinero(p.precio) + "</td>";
      html += '<td><button onclick="retirarProducto(' + p.id + ')">Retirar</button></td></tr>';
    }
  }
  html += "</table>";
  if (!hay) html = "<p>Aún no has publicado productos.</p>";
  document.getElementById("misProductos").innerHTML = html;
}

function retirarProducto(id) {
  if (confirm("¿Retirar esta publicación del catálogo?")) {
    var restantes = [];
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].id != id) restantes.push(productos[i]);
    }
    productos = restantes;
    guardar();
    dibujarMisProductos();
  }
}

if (exigirRol("vendedor")) {
  dibujarEncabezado("vendedor.html", false);
  dibujarMisProductos();
}
