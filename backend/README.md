🚀 Enterprise Management System - Backend Core
Este es el repositorio central del motor de gestión empresarial, construido sobre Java 21 y Spring Boot 4.0.3 (preparado para estándares de Spring 4). El proyecto sigue una arquitectura limpia basada en capas (MVC) y promueve la inmutabilidad de datos mediante el uso de Java Records.

🛠 Tech Stack
* Lenguaje: Java 21 (LTS)
* Framework: Spring Boot 3.4+ / 4.0 (Spring Web, Spring Data JPA)
* Gestión de Dependencias: Maven
* Base de Datos: MySQL 8.0
* ORM: Hibernate 6+
* Documentación: SpringDoc OpenAPI (Swagger)
* Utilidades: Lombok, Bean Validation.

📂 Estructura de Carpetas
Seguimos una organización por capas técnicas para asegurar el desacoplamiento:

src/main/java/com/example/backend
├── config/          # Configuraciones del sistema (Security, CORS, OpenAPI)
├── controller/      # Capa de entrada (REST Controllers)
├── service/         # Lógica de negocio e interfaces
│   └── impl/        # Implementaciones de la lógica
├── repository/      # Interacción con Spring Data JPA (MySQL)
├── model/           # Entidades JPA (Mapeo de base de datos)
├── dto/             # Data Transfer Objects (Records de entrada/salida)
│   ├── request/     # Validación de datos entrantes
│   └── response/    # Estructura de datos salientes
└── exception/       # Manejo global de errores y excepciones custom

🏛 Arquitectura y Flujo de Datos
El sistema implementa el patrón MVC adaptado a APIs REST, con un flujo unidireccional para mantener la integridad de la base de datos:

1. Controller: Recibe el RequestDTO, valida los datos y delega al servicio.
2. Service: Ejecuta la lógica de negocio. Es el único que puede transformar DTOs a Models y viceversa.
3. Repository: Interface de Spring Data para realizar operaciones CRUD en MySQL.
4. Response: El servicio retorna un ResponseDTO al controlador para ser enviado al cliente.
Regla de Oro: Nunca exponemos las Entidades (Model) directamente en los Controllers. Siempre usamos DTOs.

⚙️ Configuración del Entorno
Requisitos Previos
* JDK 21 instalado.
* Maven 3.9+.
* Instancia de MySQL (o Docker instalado).
* Cliente REST: Postman, Insomnia o la extensión "Thunder Client" en VS Code para testear los endpoints.

Instalación Rápida
1. Clonar el repositorio: git clone https://github.com/felisantillan00/Alborada_Sistema_Gestion_Proyecto.git
2. Base de Datos: Crea una DB llamada 'alborada_SistGestion' y tipo por defecto. Crea y completa los datos en el archivo src/main/resources/application.properties, tomando de ejemplo  src/main/resources/application.properties.example !!!!
3. Ejecutar: ./mvnw spring-boot:run o vicebersa mvn spring-boot:run

## 📝 Estándares de Código

🔹 **Modelos (Entidades JPA)**
* `@Entity`: Indica que es una tabla de base de datos.
* `@Table(name = "")`: Define el nombre real de la tabla en MySQL (usar snake_case).
* `@Data`: Genera automáticamente Getters, Setters, toString y equals/hashCode.
* `@Builder`: Permite crear objetos de forma fluida: `Modelo.builder().nombre("X").build()`.
* `@AllArgsConstructor`: Constructor con todos los campos (requerido por Builder).
* `@NoArgsConstructor`: Constructor vacío (requerido por Hibernate).
A nivel de Atributos:
* @Id + @GeneratedValue(strategy = GenerationType.IDENTITY): Define la Primary Key autoincremental.
* @Column(name = "nombre_columna"): Mapea el atributo a un nombre específico en la DB (Ej: nro_factura).

🔹 **Repositories (Acceso a Datos)**
* `@Repository`: Registra la interfaz como un componente de acceso a datos.
* `extends JpaRepository<Entidad, TipoID>`: Otorga métodos automáticos como `.save()`, `.findAll()`, `.findById()`, etc.

🔹 **Servicios (Lógica de Negocio)**
* `@Service`: Registra la clase en el contenedor de Spring.
* `@RequiredArgsConstructor`: Crea el constructor para Inyección de Dependencias de campos `final`.
* `@Slf4j`: Habilita el log: `log.info("Mensaje")`.
* `@Transactional`: CRÍTICO. Garantiza que si algo falla, se haga un Rollback (Ej: Si falla el stock, que no se guarde la Venta).

🔹 **DTOs (Data Transfer Objects) - Request o Response**
* `@Data`, `@Builder`, `@AllArgsConstructor`, `@NoArgsConstructor`.
* **Nota:** Usamos DTOs para no exponer la entidad de la base de datos directamente al exterior.
Validaciones de Atributos:
* @NotBlank(message = "..."): Obligatorio para texto (no nulo, no vacío).
* @NotNull(message = "..."): Obligatorio para números o fechas.

🔹 **Controllers (API Endpoints)**
* `@RestController`: Define que esta clase es un punto de entrada de la API.
* `@RequestMapping("")`: Define la URL base (ej: `/api/v1/productos`).
* `@RequiredArgsConstructor`: Inyecta los servicios necesarios automáticamente.
* `@Slf4j`: Para registrar eventos en la consola.

1. Endpoints (Naming Convention)
Para mantener la consistencia, todos los controladores deben seguir este formato:
* Prefijo Global: /api/
* Recursos en plural:
* GET /api/productos (Lista de productos)
* POST /api/ventas (Crear venta)
* GET /api/usuarios/{id} (Obtener usuario específico)

2. Reglas de Código
* Inmutabilidad: Usar record para todos los DTOs.
* Modelos: Siempre en singular (Ej: Producto, no Productos).
* Base de datos: Tablas en singular y snake_case.
* Inyección de Dependencias: Usar @RequiredArgsConstructor de Lombok en lugar de @Autowired.
* Validaciones: Todo RequestDTO debe estar anotado con @NotBlank, @Size, @Min, etc.

📖 Documentación de API
* Swagger UI: http://localhost:8080/swagger-ui.html (Para ver y probar la documentación técnica).
* Postman: Se recomienda crear una "Collection" compartida para el equipo con las peticiones base de cada módulo.

Como consumir la API? Base URL: http://localhost:8080/api
📦 Módulo: Proveedores

Listar todos
GET /proveedor

Obtener por ID
GET /proveedor/{id}

Crear nuevo
POST /proveedor
(Nota: No enviar ID en el cuerpo, se genera solo)

Actualizar existente
PUT /proveedor/{id}

Eliminar
DELETE /proveedor/{id}

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