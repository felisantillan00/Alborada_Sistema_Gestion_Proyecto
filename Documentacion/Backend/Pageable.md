Full Pagination
Cambio Importante: Todos los métodos de listado (GET a la raíz del recurso) ahora implementan Paginación Dinámica. La respuesta ya no es un Array [], sino un Objeto Page de Spring.

🛠️ Estructura de Respuesta Paginada (Para todos los GET)
Al consumir cualquier endpoint de listado, el JSON tendrá esta estructura:

JSON
{
  "content": [...],      // Lista de elementos (Productos, Marcas, etc.)
  "totalPages": 5,       // Cantidad total de páginas disponibles
  "totalElements": 50,   // Cantidad total de registros en la BD
  "size": 10,            // Tamaño de la página actual
  "number": 0,           // Índice de la página actual (empieza en 0)
  "last": false,         // Booleano: ¿Es la última página?
  "first": true          // Booleano: ¿Es la primera página?
}

📦 Módulo: Producto (/api/producto)
Listar (Paginado): GET /

Ejemplo: /api/producto?page=0&size=5&sort=precioVenta,desc

Buscar: GET /find?q={nombre_o_id}

CRUD: GET /{id}, POST /, PUT /{id}, DELETE /{id}

📦 Módulo: Proveedor (/api/proveedor)
Listar (Paginado): GET /

Ejemplo: /api/proveedor?page=0&size=10&sort=nombre,asc

CRUD: GET /{id}, POST /, PUT /{id}, DELETE /{id}

📦 Módulo: Marca (/api/marca)
Listar (Paginado): GET /

CRUD: GET /{id}, POST /, PUT /{id}, DELETE /{id}

📦 Módulo: Categoría (/api/categoria)
Listar (Paginado): GET /

CRUD: GET /{id}, POST /, PUT /{id}, DELETE /{id}