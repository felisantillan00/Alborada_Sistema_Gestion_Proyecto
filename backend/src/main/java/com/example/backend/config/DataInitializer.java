package com.example.backend.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.backend.service.VentaService;
import com.example.backend.enums.EstadoOrden;
import com.example.backend.dto.request.*;
import jakarta.transaction.Transactional;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import com.example.backend.model.*;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final ProveedorRepository proveedorRepository;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final OrdenServicioRepository ordenServicioRepository;
    private final VentaRepository ventaRepository;
    private final VentaService ventaService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Cargamos Proveedores
        if (proveedorRepository.count() == 0) {
            log.info("Cargando proveedores iniciales...");
            proveedorRepository.save(Proveedor.builder()
                    .nombre("Distribuidora Pampeana")
                    .cuit("20-12345678-9")
                    .email("contacto@pampeana.com")
                    .direccion("Calle 13, General Pico")
                    .build());
            proveedorRepository.save(Proveedor.builder()
                    .nombre("BiciPartes S.A.")
                    .cuit("30-98765432-1")
                    .email("ventas@bicipartes.com")
                    .build());
        }

        // 2. Cargamos Marcas
        if (marcaRepository.count() == 0) {
            log.info("Cargando marcas iniciales...");
            marcaRepository.save(Marca.builder().nombre("Shimano").descripcion("Componentes de transmisión").build());
            marcaRepository.save(Marca.builder().nombre("Maxxis").descripcion("Cubiertas de alta gama").build());
            marcaRepository.save(Marca.builder().nombre("Venzo").descripcion("Cuadros y bicicletas completas").build());
        }

        // 3. Cargamos Categorias
        if (categoriaRepository.count() == 0) {
            log.info("Cargando categorias iniciales...");
            categoriaRepository.save(
                    Categoria.builder().nombre("Transmisión").descripcion("Piñones, cadenas, descarriladores").build());
            categoriaRepository
                    .save(Categoria.builder().nombre("Cubiertas").descripcion("Neumáticos para todo terreno").build());
            categoriaRepository.save(Categoria.builder().nombre("Bicicletas").descripcion("Bicis completas").build());
        }

        // 4. Cargamos Productos
        if (productoRepository.count() == 0) {
            log.info("Cargando productos iniciales...");

            // Buscamos las dependencias (usamos orElseThrow para detectar errores de tipeo
            // rápido)
            Categoria catTransmision = categoriaRepository.findByNombre("Transmisión").orElseThrow();
            Categoria catCubiertas = categoriaRepository.findByNombre("Cubiertas").orElseThrow();
            Categoria catBicis = categoriaRepository.findByNombre("Bicicletas").orElseThrow();

            Marca marcaShimano = marcaRepository.findByNombre("Shimano").orElseThrow();
            Marca marcaMaxxis = marcaRepository.findByNombre("Maxxis").orElseThrow();
            Marca marcaVenzo = marcaRepository.findByNombre("Venzo").orElseThrow();

            Proveedor provPampeana = proveedorRepository.findByNombre("Distribuidora Pampeana").orElse(null);

            // --- PRODUCTO 1: Transmisión ---
            productoRepository.save(Producto.builder()
                    .nombre("Cassette Shimano 11-32")
                    .descripcion("Cassette de 11 velocidades, rango 11-32 dientes")
                    .precioCosto(new BigDecimal("50000.00"))
                    .precioVenta(new BigDecimal("80000.00"))
                    .stock(new BigDecimal("15"))
                    .stockMinimo(new BigDecimal("5"))
                    .margenGanancia(new BigDecimal("60.00"))
                    .categoria(catTransmision)
                    .marca(marcaShimano)
                    .proveedor(provPampeana)
                    .build());

            // --- PRODUCTO 2: Cubierta (Para probar ALERTA DE STOCK BAJO) ---
            productoRepository.save(Producto.builder()
                    .nombre("Cubierta Maxxis Ikon 29x2.20")
                    .descripcion("Cubierta de competición para XC")
                    .precioCosto(new BigDecimal("45000.00"))
                    .precioVenta(new BigDecimal("72000.00"))
                    .stock(new BigDecimal("3")) // Menor al mínimo!
                    .stockMinimo(new BigDecimal("5"))
                    .margenGanancia(new BigDecimal("60.00"))
                    .categoria(catCubiertas)
                    .marca(marcaMaxxis)
                    .proveedor(provPampeana)
                    .build());

            // --- PRODUCTO 3: Bicicleta Completa ---
            productoRepository.save(Producto.builder()
                    .nombre("Bicicleta Venzo Talon Rodado 29")
                    .descripcion("Cuadro de aluminio, 21 velocidades Shimano")
                    .precioCosto(new BigDecimal("350000.00"))
                    .precioVenta(new BigDecimal("525000.00"))
                    .stock(new BigDecimal("10"))
                    .stockMinimo(new BigDecimal("2"))
                    .margenGanancia(new BigDecimal("50.00"))
                    .categoria(catBicis)
                    .marca(marcaVenzo)
                    .proveedor(provPampeana)
                    .build());

            log.info("Carga de productos finalizada con éxito.");
        }
        if (ordenServicioRepository.count() == 0) {
            log.info("Cargando órdenes de servicio (Presupuestos y Reparaciones) iniciales...");

            // Traemos todos los productos para usarlos en los detalles
            List<Producto> productos = productoRepository.findAll();

            if (productos.size() >= 2) {
                Producto cassette = productos.get(0);
                Producto cubierta = productos.get(1);

                // --- 5.1 Creamos un Presupuesto de Prueba ---
                OrdenServicio presupuesto = new OrdenServicio();
                presupuesto.setObservacion("Cliente consultó por cambio de cubiertas.");
                presupuesto.setIsReparacion(false);
                presupuesto.setEstadoReparacion(EstadoOrden.Pendiente_Aprobacion);
                presupuesto.setValorManoObra(new BigDecimal("20000.00"));

                DetalleOrdenServicio det1 = new DetalleOrdenServicio();
                det1.setProducto(cubierta);
                det1.setCantidad(2);
                det1.setValorUnitario(cubierta.getPrecioVenta());
                presupuesto.addDetalle(det1);

                // Matemática manual del total
                BigDecimal sub1 = det1.getValorUnitario().multiply(new BigDecimal(det1.getCantidad()));
                presupuesto.setValorTotal(sub1.add(presupuesto.getValorManoObra()));

                ordenServicioRepository.save(presupuesto);

                // --- 5.2 Creamos una Reparación Finalizada de Prueba ---
                OrdenServicio reparacion = new OrdenServicio();
                reparacion.setObservacion("Se reemplazó la transmisión vieja.");
                reparacion.setIsReparacion(true);
                reparacion.setEstadoReparacion(EstadoOrden.Finalizado);
                reparacion.setValorManoObra(new BigDecimal("25000.00"));
                reparacion.setFechaConfirmacion_reparacion(LocalDateTime.now().minusDays(2)); // Confirmada hace 2 días

                DetalleOrdenServicio det2 = new DetalleOrdenServicio();
                det2.setProducto(cassette);
                det2.setCantidad(1);
                det2.setValorUnitario(cassette.getPrecioVenta());
                reparacion.addDetalle(det2);

                // Matemática manual del total
                BigDecimal sub2 = det2.getValorUnitario().multiply(new BigDecimal(det2.getCantidad()));
                reparacion.setValorTotal(sub2.add(reparacion.getValorManoObra()));

                ordenServicioRepository.save(reparacion);

                log.info("Carga de órdenes finalizada con éxito.");
                // 5. Cargamos Ventas de prueba
                if (ventaRepository.count() == 0) {
                    log.info("Cargando ventas iniciales de prueba...");

                    // Traigo todos los productosVenta para obtener sus IDs y crear ventas de
                    // prueba.
                    List<Producto> productosVenta = productoRepository.findAll();

                    if (productosVenta.size() >= 2) {
                        Producto prod1 = productosVenta.get(0);
                        Producto prod2 = productosVenta.get(1);

                        // Creo una venta de prueba con 2 productos (1 unidad del primero y 2 unidades
                        // del segundo)
                        VentaRequestDTO ventaPrueba = new VentaRequestDTO(
                                "EFECTIVO",
                                "Prueba de venta",
                                "Lionel Messi",
                                List.of(
                                        new DetalleVentaRequestDTO(prod1.getId(), 1),
                                        new DetalleVentaRequestDTO(prod2.getId(), 2)));

                        ventaService.create(ventaPrueba);
                        log.info("Ventas de prueba cargadas con éxito.");
                    }
                }

            }
        }
    }
}