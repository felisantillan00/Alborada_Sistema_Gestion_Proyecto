📝 Formato del JSON (Request Body)
Para POST y PUT, usar esta estructura:

JSON
{
  "nombre": "Nombre del Proveedor",
  "cuit": "20-XXXXXXXX-X",
  "telefono": "2302-XXXXXX",
  "email": "ejemplo@correo.com",
  "direccion": "Calle Falsa 123",
  "observacion": "Opcional"
}

📦 Módulo: Marca - Base URL: http://localhost:8080/api
* Listar todas GET /marca
* Obtener por ID GET /marca/{id}
* Crear nueva POST /marca - (Nota: No enviar ID en el cuerpo)
* Actualizar existente PUT /marca/{id} - (Nota: El ID de la URL y el del JSON deben coincidir)
* Eliminar DELETE /marca/{id}
📝 Formato del JSON (Request Body)
{
  "id": 1, 
  "nombre": "Shimano",
  "descripcion": "Componentes de transmisión y frenos"
}

📦 Módulo: Categoria - Base URL: http://localhost:8080/api
* Listar todas GET /categoria
* Obtener por ID GET /categoria/{id}
* Crear nueva POST /categoria - (Nota: No enviar ID en el cuerpo)
* Actualizar existente PUT /categoria/{id} - (Nota: El ID de la URL y el del JSON deben coincidir)
* Eliminar DELETE /categoria/{id}
📝 Formato del JSON (Request Body)
{
  "id": 1, 
  "nombre": "Ruedas",
  "descripcion": "Componentes de transmisión y frenos"
}

📦 Módulo: Producto - Base URL: http://localhost:8080/api
* Listar todos: GET /producto
* Buscar por nombre o ID: GET /producto/find?q={nombre_o_id}
* Obtener por ID: GET /producto/{id}
* Crear nuevo: POST /producto
* Actualizar (Flexible): PUT /producto/{id} - (Nota: Podés enviar solo los campos que quieras modificar. El sistema recalcula precios automáticamente si envías costo o margen).
* Eliminar: DELETE /producto/{id}

📝 Formato del JSON (Request Body)
Para POST y PUT, usar la siguiente estructura.
Importante: En el POST, idCategoria e idMarca son obligatorios.
{
  "nombre": "Cubierta Maxxis Ikon 29x2.20",
  "descripcion": "Cubierta de competición para XC",
  "precioCosto": 45000.00,
  "margenGanancia": 60.0,
  "precioVenta": 72000.00,
  "stock": 10,
  "stockMinimo": 2,
  "idCategoria": 2,
  "idMarca": 2,
  "idProveedor": 1
}

💡 Notas de Lógica de Negocio para el Front:
* Cálculo de Precios: - Si envían precioCosto + margenGanancia, el sistema calcula el precioVenta.
* Si envían precioCosto + precioVenta, el sistema calcula el % de margenGanancia.
* Updates Parciales: En el PUT, si no envían un campo (ej. no mandan descripcion), el valor actual en la base de datos se mantiene intacto.
* Validación de Stock: El sistema arrojará un error 400 si se intenta descontar más stock del disponible.