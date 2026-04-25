📝 Formato del JSON (Request Body)
Para POST y PUT de Ventas, usar la siguiente estructura:

```json
{
  "nombreCliente": "Juan Pérez",
  "observacion": "Venta realizada en el mostrador principal",
  "formaPago": "EFECTIVO", 
  "detalles": [
    {
      "idProducto": 1,
      "cantidad": 2
    },
    {
      "idProducto": 5,
      "cantidad": 1
    }
  ]
}
```
*Nota sobre `formaPago`: El sistema acepta los valores definidos en tu Enum `FormaPago`. Internamente los convierte a mayúsculas, por lo que enviar `"efectivo"`, `"Efectivo"` o `"EFECTIVO"` funcionará correctamente.*

📦 Módulo: Venta - Base URL: `http://localhost:8080/api/venta`

* **Listar todas (Paginado)**: `GET /venta`
  *(Ejemplo: `/api/venta?page=0&size=10&sort=fechaVenta,desc`)*
* **Crear nueva**: `POST /venta` 
  *(Nota: Nace con la fecha actual y descuenta stock automáticamente de los productos involucrados).*
* **Actualizar existente**: `PUT /venta/{id}` 
  *(Nota: Reemplaza todos los detalles. El sistema repone el stock de los productos de la venta original y descuenta el stock de los productos nuevos enviados).*
* **Eliminar**: `DELETE /venta/{id}` 
  *(Nota: Elimina el registro histórico de la venta y **devuelve el stock** de todos los productos de esa venta al inventario).*

---

💡 Notas de Lógica de Negocio (Para el Frontend):

* **Control Estricto de Stock**:
  * El sistema validará línea por línea que cada producto posea suficiente stock.
  * Si se intenta vender una cantidad mayor a la disponible, el backend arrojará un error 400 (`NegocioException`) con el mensaje: *"Stock insuficiente para el producto 'X'. Actual: Y, Solicitado: Z"*.
  * La venta es transaccional (`@Transactional`). Si **un solo** producto no tiene stock, **toda la venta** se cancela y no se descuenta nada por error.
  * Las cantidades de los detalles deben ser estrictamente **mayores a cero**.

* **Cálculo de Precios (Automático)**:
  * El Frontend **no necesita enviar los precios**. El backend tomará automáticamente el `precioVenta` actual del producto directo de la Base de Datos al momento de confirmar la transacción.
  * El subtotal por línea y el `totalVenta` general son calculados dinámicamente desde el backend.

* **Integridad de Datos en Actualización (PUT)**:
  * El proceso de `UPDATE` borra los detalles anteriores de la venta y los vuelve a insertar limpios. Al mismo tiempo repone el stock viejo al inventario antes de descontar el nuevo.
  
* **Eliminación Segura**:
  * Si se da de baja una venta por error (`DELETE`), no se pierde el inventario. Los artículos vuelven instantáneamente a sumarse al stock de productos.
