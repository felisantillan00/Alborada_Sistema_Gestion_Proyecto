📝 Formato del JSON (Request Body)
Para POST/PUT usar esta estructura:

JSON {
  "idProveedor": 2,
  "formaPago": "TRANSFERENCIA",
  "detalles": [
    {
      "idProducto": 1,
      "cantidad": 2,
      "precioCompra": 15000.00
    }
  ]
}

📤 Formato de Respuesta (Response)
JSON{"id":9,"productos":[{"id":1,"nombre":"Cassette Shimano 11-32"}],"totalCompra":30000.00,"proveedorNombre":"BiciPartes S.A.","formaPago":"TRANSFERENCIA","fechaCompra":"2026-05-02T17:08:24.860194"}

📦 Módulo: Compra - Base URL: http://localhost:8080/api
* Listar todas GET /compra
* Obtener por ID GET /compra/{id}
* Crear nueva POST /compra
* Actualizar existente PUT /compra/{id} 
* Eliminar DELETE /compra/{id}

#La compra debe incluir al menos un producto en detalles.
#El sistema suma automáticamente la cantidad comprada al stock actual del producto.
#El sistema mantiene el margenGanancia histórico y recalcula automáticamente el precioVenta basándose en el nuevo costo.
#El producto queda asociado al proveedor de la compra actual (se pisa/sobreescribe el proveedor anterior).

Atributos obligatorios: idProveedor, detalles, detalle.idProducto, detalle.cantidad, detalle.precioCompra

