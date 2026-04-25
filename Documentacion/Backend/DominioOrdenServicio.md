📝 Formato del JSON (Request Body)
Para POST y PUT, usar esta estructura:

JSON
{
  "valorManoDeObra": "30000.00",
  "detalles": [
    {
      "idProducto": 3,
      "cantidad":5
    },
    {
      "idProducto": 2,
      "cantidad": 1
    }
  ],
  "observacion": "Reparacion de bici Firebird roja"
}

📦 Módulo: Presupuesto - Base URL: http://localhost:8080/api/presupuesto
* Listar todos los presupuestos: GET /presupuesto (Solo trae órdenes en estado Pendiente)
* Obtener por ID: GET /presupuesto/{id}
* Crear nuevo: POST /presupuesto - (Nota: Nace con estado Pendiente_Aprobacion. No descuenta stock).
* Actualizar datos: PUT /presupuesto/{id} - (Nota: Reemplaza todos los detalles).
* Aprobar Presupuesto (Cambio de Estado): PUT /presupuesto/{id}/estado - (Nota: Pasa a Aprobado_Presupuesto, se transforma en Reparación y descuenta stock).
* Eliminar: DELETE /presupuesto/{id}

📦 Módulo: Reparación - Base URL: http://localhost:8080/api/reparacion
* Listar todas: GET /reparacion (Solo trae órdenes aprobadas o finalizadas)
* Obtener por ID: GET /reparacion/{id}
* Crear nueva (Directa): POST /reparacion - (Nota: Nace con estado Aprobado_Presupuesto. Descuenta stock al instante).
* Actualizar datos: PUT /reparacion/{id}
* Finalizar Reparación (Cambio de Estado): PUT /reparacion/{id}/estado - (Nota: Pasa a estado Finalizado).
* Eliminar: DELETE /reparacion/{id} - (Nota: Devuelve el stock al inventario antes de borrarse).

+ Cuando se hace un update de un presupuesto se van a actualizar los precios a los actuales, si se hace un update a una reparación los precios se mantienen a los presupuestados
+ Al eliminar una reparacion Finalizada el stock no se vuelve a sumar
