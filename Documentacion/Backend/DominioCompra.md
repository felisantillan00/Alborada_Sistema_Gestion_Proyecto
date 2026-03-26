📝 Formato del JSON (Request Body)
Para POST/PUT usar esta estructura:

JSON{   
  "proveedorNombre": "Proveedor SA",
  "totalCompra": 150000.00, (si no se le pasa el total, lo calcula manualmente)
  "detalles": [
    {
      "producto": {
        "id": 5
      },
      "cantidad": 10,
      "precioCompra": 12000.00 (si no se pasa un precio, usa el ya existente)
    },
    {
      "producto": {
        "id": 8
      },
      "cantidad": 5,
      "precioCompra": 6000.00
    }
  ]
}

📤 Formato de Respuesta (Response)
JSON{
  "id": 1,
  "proveedorNombre": "Proveedor SA",
  "totalCompra": 150000.00,
  "fechaCompra": "2025-03-23T14:30:00",
  "productos": [
    {
      "id": 5,
      "nombre": "Cubierta Maxxis Ikon 29x2.20"
    },
    {
      "id": 8,
      "nombre": "Pedales Shimano XT"
    }
  ]
}

📦 Módulo: Compra - Base URL: http://localhost:8080/api
* Listar todas GET /compra
* Obtener por ID GET /compra/{id}
* Crear nueva POST /compra - (Nota: No enviar ID en el cuerpo)
* Actualizar existente PUT /compra/{id} 
* Eliminar DELETE /compra/{id}


#La compra debe incluir al menos un producto en detalles.
#El sistema suma automáticamente la cantidad comprada al stock actual del producto.
#El sistema mantiene el margenGanancia histórico y recalcula automáticamente el precioVenta basándose en el nuevo costo.
#El producto queda asociado al proveedor de la compra actual (se pisa/sobreescribe el proveedor anterior).

Atributos obligatorios: proveedorNombre, detalles, detalles[].producto.id, detalles[].cantidad

Ejemplo de Flujo:

Crear una compra de 10 cubiertas a $12000 c/u
Request:
jsonPOST /compra
{
  "proveedorNombre": "Bicicletas del Sur",
  "totalCompra": 120000.00,
  "detalles": [
    {
      "producto": { "id": 5 },
      "cantidad": 10,
      "precioCompra": 12000.00
    }
  ]
}

Efectos:
Stock del producto con id 5: +10 unidades
Precio costo del producto con id 5: $12.000
Precio venta recalculado según margen histórico
Proveedor del producto con id 5: "Bicicletas del Sur"
