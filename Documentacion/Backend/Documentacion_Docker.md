🔄 Flujo de actualización (Develop -> Docker -> Render)
Respecto a tu duda: No es 100% automático porque estás usando el flujo de Docker Hub, pero se puede hacer muy rápido siguiendo estos pasos cada vez que el equipo fusione cambios en la rama develop.

¿Es automático?
Actualmente, Render está escuchando a Docker Hub, no directamente a tu GitHub. Entonces:

Si alguien sube código a GitHub: No pasa nada en Render.

Si vos subís una imagen nueva a Docker Hub con el mismo tag (latest): Render detecta el cambio y actualiza automáticamente.

El "Manual de Procedimiento" para actualizar:
Cada vez que quieras que los cambios de develop se vean en la nube, tenés que ejecutar este "combo" de comandos en tu terminal (parado en la carpeta del backend):

Bajar lo último de los chicos: git checkout develop + git pull origin develop.

Generar el nuevo archivo de Java: mvn clean package -DskipTests.

Crear y subir la imagen (El "Trigger" para Render):

Bash
docker build -t felesantillan00/alborada-backend:latest .
docker push felesantillan00/alborada-backend:latest
💡 Tip de Pro:
Una vez que hagas el docker push, Render suele tardar un par de minutos en darse cuenta. Si tenés apuro, podés ir al panel de Render y darle a "Manual Deploy" -> "Deploy latest image".

Gemini ha dicho
¡Perfecto, Felipe! Está muy completo. Lo ideal es presentarle esto al grupo de forma clara y jerarquizada, para que Ori y Feli no se pierdan entre tantos datos y puedan probar todo desde Postman o el Front rápido.

Acá tenés la versión final del mensaje para que la pegues en el grupo:

🚀 API Alborada - Guía de Endpoints (Backend Live)
Hola equipo, el backend ya está corriendo en la nube. Les dejo la documentación de los endpoints y los formatos de datos para que empiecen a conectar el Frontend.

🔗 URL Base: https://alborada-backend-latest.onrender.com/api

📦 Módulo: Productos
Listar todos: GET /producto

Obtener por ID: GET /producto/{id}

Buscar (nombre/ID): GET /producto/find?q={query}

Crear: POST /producto

Actualizar: PUT /producto/{id} (Soporta cambios parciales).

Eliminar: DELETE /producto/{id}

📝 Formato JSON (POST/PUT):

JSON
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
📦 Módulo: Proveedores
Listar todos: GET /proveedor

Crear: POST /proveedor (No enviar ID).

Actualizar: PUT /proveedor/{id}

Eliminar: DELETE /proveedor/{id}

📝 Formato JSON:

JSON
{
  "nombre": "Nombre del Proveedor",
  "cuit": "20-XXXXXXXX-X",
  "telefono": "2302-XXXXXX",
  "email": "ejemplo@correo.com",
  "direccion": "Calle Falsa 123",
  "observacion": "Opcional"
}
📦 Módulos: Marcas y Categorías
Endpoints: GET, POST, PUT, DELETE sobre /marca o /categoria.

Importante: En el PUT, el ID de la URL y el del JSON deben coincidir. En el POST, no envíen el ID.

📝 Formato JSON (Ejemplo Marca):

JSON
{
  "nombre": "Shimano",
  "descripcion": "Componentes de transmisión"
}
💡 Notas de Lógica (Para el Front):
Cálculo Automático: * Si mandan precioCosto + margenGanancia, el sistema calcula el precioVenta.

Si mandan precioCosto + precioVenta, el sistema calcula el % de margen.

Updates Parciales: En los PUT, si omiten un campo (ej. no mandan la descripción), el valor actual en la base se mantiene.

Stock: El sistema tira Error 400 si intentan descontar más stock del que hay disponible.

CORS: Ya está configurado para aceptar peticiones desde el Front.

🔄 ¿Cómo actualizamos el servidor? Recordamos que cada vez que mergeen en develop y quieras subir los cambios, estando en el path ./backend, hay que hacer:
1. mvn clean package -DskipTests
2. docker build -t felesantillan00/alborada-backend:latest .
3. docker push felesantillan00/alborada-backend:latest
** Y Render se encarga del resto al detectar la imagen nueva. **