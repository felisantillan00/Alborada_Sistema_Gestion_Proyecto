Documentación de la API - Alborada Sistema de Gestión

Módulo: HITO 6 - Estadísticas y Saldos

URL Base: /estadisticas


### 1. Obtener el balance del mes actual
Calcula y devuelve los ingresos, gastos, ganancias netas y el promedio de ganancia diaria correspondientes al mes en curso.

	* URL: /estadisticas
	* Método HTTP: GET
	* Cuerpo de la Petición: Ninguno.
	* Si la respuesta es exitosa : Devuelve un objeto GetEstadisticasDTO.

 JSON:
  {
    "ingresosMensuales": 450000.00,
    "gastosMensuales": 150000.00,
    "gananciasMensuales": 300000.00,
    "promedioGananciasMensuales": 18750.00
  }


### 2. Obtener datos comparativos (Pie)
Devuelve los ingresos totales históricos de ventas vs. reparaciones

	URL: /estadisticas/pie
	* Método HTTP: GET
	* Cuerpo de la Petición: Ninguno.
	* Si la respuesta es exitosa : Devuelve un objeto PieCharDTO
JSON:
{
  "totalVentas": 1250000.00,
  "totalReparaciones": 850000.00
}


### 3. Obtener reparaciones mensuales 
Devuelve el total de ingresos generados por reparaciones agrupado mes a mes durante el último semestre.
	URL: /estadisticas/reparaciones-mensuales
	* Método HTTP: GET
	* Cuerpo de la Petición: Ninguno.
	* Si la respuesta es exitosa : Devuelve un objeto MetricaMensualDTO

JSON:
[
  {
    "mes": "noviembre",
    "total": 120000.00
  },
  {
    "mes": "diciembre",
    "total": 180000.00
  }
]


### 4. Obtener ventas mensuales 
Devuelve el total de ingresos generados por ventas de productos agrupado mes a mes durante el último semestre.

	URL: /estadisticas/ventas-mensuales
	* Método HTTP: GET
	* Cuerpo de la Petición: Ninguno.
	* Si la respuesta es exitosa : Devuelve un objeto MetricaMensualDTO

JSON:
[
  {
    "mes": "noviembre",
    "total": 80000.00
  },
  {
    "mes": "diciembre",
    "total": 150000.00
  }
]


### 5. Obtener compras/gastos mensuales
Devuelve el total de dinero invertido en compras (gastos) agrupado mes a mes durante el último semestre.
	URL: /estadisticas/compras-mensuales
	* Método HTTP: GET
	* Cuerpo de la Petición: Ninguno.
	* Si la respuesta es exitosa : Devuelve un objeto MetricaMensualDTO

JSON:
[
  {
    "mes": "noviembre",
    "total": 50000.00
  },
  {
    "mes": "diciembre",
    "total": 90000.00
  }
]
