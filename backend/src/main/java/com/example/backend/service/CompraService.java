package com.example.backend.service;

import com.example.backend.dto.request.CompraRequestDTO;
import com.example.backend.dto.request.DetalleCompraRequestDTO;
import com.example.backend.dto.response.CompraResponseDTO;
import com.example.backend.dto.response.ProductoResponseCompraDTO;
import com.example.backend.exception.NegocioException;
import com.example.backend.model.Compra;
import com.example.backend.model.DetalleCompra;
import com.example.backend.model.Producto;
import com.example.backend.model.Proveedor;
import com.example.backend.repository.CompraRepository;
import com.example.backend.repository.ProductoRepository;
import com.example.backend.repository.ProveedorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;
    private final ProveedorRepository proveedorRepository;

    public CompraResponseDTO create(CompraRequestDTO request) {
        log.info("Iniciando registro de compra para el proveedor: {}", request.proveedorNombre());

        // 1. Validar que la compra tenga detalles
        if (request.detalles() == null || request.detalles().isEmpty()) {
            throw new NegocioException("La compra debe tener al menos un producto detallado.");
        }

        // 2. Validar que exista el proveedor por su nombre
        Proveedor proveedor = proveedorRepository.findByNombre(request.proveedorNombre())
                .orElseThrow(() -> new NegocioException("Proveedor no encontrado con nombre: " + request.proveedorNombre()));

        Compra nuevaCompra = new Compra();
        nuevaCompra.setProveedor(proveedor);
        nuevaCompra.setFechaCompra(LocalDateTime.now());

        int cantidadTotal = request.detalles().stream()
                .mapToInt(DetalleCompraRequestDTO::cantidad)
                .sum();
        nuevaCompra.setCantidadTotal(cantidadTotal);

        double totalCalculado = 0.0;
        List<DetalleCompra> detallesEntidad = new ArrayList<>();

        // 3. Procesar los detalles, actualizar stock y calcular subtotales
        for (DetalleCompraRequestDTO detalleDTO : request.detalles()) {
            
            Producto producto = productoRepository.findById(detalleDTO.producto().id())
                    .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + detalleDTO.producto().id()));

            if (detalleDTO.cantidad() <= 0) {
                throw new NegocioException("La cantidad a comprar debe ser mayor a cero.");
            }

            Double precioUnitarioAUsar;
            
            if (detalleDTO.precioCompra() != null) {
                // Opción A: El usuario mandó un precio nuevo en el JSON
                precioUnitarioAUsar = detalleDTO.precioCompra();
            } else {
                // Opción B: Vino null, usamos el precio histórico de la base de datos
                if (producto.getPrecioCosto() == null) {
                    throw new NegocioException("El producto '" + producto.getNombre() + "' no tiene un precio registrado en el sistema. Debe ingresarlo manualmente.");
                }
                // Convertimos el BigDecimal de la BD al Double que usamos para calcular
                precioUnitarioAUsar = producto.getPrecioCosto().doubleValue(); 
            }
            
            // --- A. ACTUALIZAMOS STOCK ---
            BigDecimal cantidadComprada = BigDecimal.valueOf(detalleDTO.cantidad());
            producto.setStock(producto.getStock().add(cantidadComprada));

            // --- B. ACTUALIZAMOS PRECIOS Y PROVEEDOR 
            producto.setProveedor(proveedor); // Pisamos al proveedor viejo con el nuevo de la compra
            
            BigDecimal nuevoCosto = BigDecimal.valueOf(precioUnitarioAUsar);
            producto.setPrecioCosto(nuevoCosto);
            
            // Recalculamos el precio de venta público manteniendo el margen de ganancia histórico
            if (producto.getMargenGanancia() != null && producto.getMargenGanancia().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal ganancia = nuevoCosto
                        .multiply(producto.getMargenGanancia())
                        .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                
                producto.setPrecioVenta(nuevoCosto.add(ganancia));
            } 
        
            // --- C. ARMAMOS EL DETALLE ---
            double subtotal = detalleDTO.cantidad() * precioUnitarioAUsar; 
            totalCalculado += subtotal;

            DetalleCompra nuevoDetalle = new DetalleCompra();
            nuevoDetalle.setProducto(producto);
            nuevoDetalle.setCantidad(detalleDTO.cantidad());
            nuevoDetalle.setPrecioUnitario(precioUnitarioAUsar); 
            nuevoDetalle.setSubtotal(subtotal);
            
            nuevoDetalle.setCompra(nuevaCompra); 
            detallesEntidad.add(nuevoDetalle);
        }

        if (request.totalCompra() != null) {
            if (Math.abs(totalCalculado - request.totalCompra()) > 0.01) {
                throw new NegocioException(
                    String.format("El total enviado (%s) no coincide con la suma real de los subtotales (%s)", 
                    request.totalCompra(), totalCalculado)
                );
            }
        }

        nuevaCompra.setDetalles(detallesEntidad);
        nuevaCompra.setTotalCompra(totalCalculado);

        // 5. Guardar la compra
        Compra guardada = compraRepository.save(nuevaCompra);
        log.info("Compra registrada exitosamente con ID: {}", guardada.getId());

        return mapToDTO(guardada);
    }

    // --- 2. LISTAR ---
    public List<CompraResponseDTO> listAll() {
        return compraRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- 3. BUSCAR POR ID ---
    public CompraResponseDTO findById(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Compra no encontrada"));
        return mapToDTO(compra);
    }

    // --- 4.UPDATE --- 
    public CompraResponseDTO update(Long id, CompraRequestDTO request) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Compra no encontrada con ID: " + id));

        // 1. Actualizar nombre Proveedor
        if (request.proveedorNombre() != null && !request.proveedorNombre().isBlank()) {
            Proveedor proveedor = proveedorRepository.findByNombre(request.proveedorNombre())
                    .orElseThrow(() -> new NegocioException("Proveedor no encontrado con nombre: " + request.proveedorNombre()));
            compra.setProveedor(proveedor);
        }

        // 2. Lógica de Detalles y Stock (Solo si el Request mandó una lista de detalles nueva)
        if (request.detalles() != null && !request.detalles().isEmpty()) {
            
            // PASO A: Revertir SOLO EL STOCK de los detalles VIEJOS
            for (DetalleCompra detalleViejo : compra.getDetalles()) {
                Producto productoViejo = detalleViejo.getProducto();
                BigDecimal cantidadARestar = BigDecimal.valueOf(detalleViejo.getCantidad());
                
                // 1. Le devolvemos al producto el stock que le habíamos sumado
                productoViejo.setStock(productoViejo.getStock().subtract(cantidadARestar));
                
                detalleViejo.setCompra(null); 
            }

            // PASO B: Vaciar los detalles viejos y FORZAR EL BORRADO en la BD
            compra.getDetalles().clear();
            compraRepository.flush();

            // PASO C: Procesar los detalles NUEVOS, sumar stock, ACTUALIZAR COSTOS y recalcular total
            double nuevoTotalCalculado = 0.0;
            
            int nuevaCantidadTotal = request.detalles().stream()
                .mapToInt(DetalleCompraRequestDTO::cantidad)
                .sum();
            compra.setCantidadTotal(nuevaCantidadTotal);
            
            // Recuperamos el proveedor (ya sea el nuevo si lo cambiaron, o el mismo que ya tenía la compra)
            Proveedor proveedorActual = compra.getProveedor(); 
            
            for (DetalleCompraRequestDTO detalleNuevoDTO : request.detalles()) {
                Producto productoNuevo = productoRepository.findById(detalleNuevoDTO.producto().id())
                        .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + detalleNuevoDTO.producto().id()));

                if (detalleNuevoDTO.cantidad() <= 0) {
                    throw new NegocioException("La cantidad debe ser mayor a cero.");
                }

                Double precioUnitarioAUsar;
                
                if (detalleNuevoDTO.precioCompra() != null) {
                    precioUnitarioAUsar = detalleNuevoDTO.precioCompra();
                } else {
                    if (productoNuevo.getPrecioCosto() == null) {
                        throw new NegocioException("El producto '" + productoNuevo.getNombre() + "' no tiene un precio registrado. Debe ingresarlo.");
                    }
                    precioUnitarioAUsar = productoNuevo.getPrecioCosto().doubleValue(); 
                }

                // --- 1. ACTUALIZAR STOCK ---
                BigDecimal cantidadASumar = BigDecimal.valueOf(detalleNuevoDTO.cantidad());
                productoNuevo.setStock(productoNuevo.getStock().add(cantidadASumar));

                // --- 2. ACTUALIZAR PRECIOS Y PROVEEDOR (Nueva Regla) ---
                productoNuevo.setProveedor(proveedorActual);
                
                BigDecimal nuevoCosto = BigDecimal.valueOf(precioUnitarioAUsar);
                productoNuevo.setPrecioCosto(nuevoCosto);
                
                if (productoNuevo.getMargenGanancia() != null && productoNuevo.getMargenGanancia().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal ganancia = nuevoCosto
                            .multiply(productoNuevo.getMargenGanancia())
                            .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                    
                    productoNuevo.setPrecioVenta(nuevoCosto.add(ganancia));
                }

                // --- 3. ARMAR DETALLE Y TOTAL ---
                double subtotal = detalleNuevoDTO.cantidad() * precioUnitarioAUsar;
                nuevoTotalCalculado += subtotal;

                DetalleCompra nuevoDetalle = new DetalleCompra();
                nuevoDetalle.setProducto(productoNuevo);
                nuevoDetalle.setCantidad(detalleNuevoDTO.cantidad());
                nuevoDetalle.setPrecioUnitario(precioUnitarioAUsar);
                nuevoDetalle.setSubtotal(subtotal);
                nuevoDetalle.setCompra(compra);

                compra.getDetalles().add(nuevoDetalle);
            }

            // PASO D: Validar el nuevo total general
            if (request.totalCompra() != null) {
                if (Math.abs(nuevoTotalCalculado - request.totalCompra()) > 0.01) {
                    throw new NegocioException(
                    String.format("El total enviado (%s) no coincide con la suma real de los subtotales (%s)", 
                    request.totalCompra(), nuevoTotalCalculado)
                    );
                }
            }       
            compra.setTotalCompra(nuevoTotalCalculado);
        }

        // 3. Guardar y mapear la respuesta
        Compra actualizada = compraRepository.save(compra);
        return mapToDTO(actualizada);
    }

    // --- 5. DELETE ---
    public void delete(Long id) {
        log.info("Iniciando borrado de compra con ID: {}", id);

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Compra no encontrada con ID: " + id));

        // 1. REVERTIR EL STOCK
        for (DetalleCompra detalle : compra.getDetalles()) {
            Producto producto = detalle.getProducto();
            BigDecimal cantidadARestar = BigDecimal.valueOf(detalle.getCantidad());
            
            // Medida de seguridad: Evitar que el borrado deje el stock en negativo
            if (producto.getStock().compareTo(cantidadARestar) < 0) {
                throw new NegocioException(
                    String.format("No se puede borrar la compra. El producto '%s' quedaría con stock negativo (%s unidades disponibles).", 
                    producto.getNombre(), producto.getStock())
                );
            }
            
            // Descontamos lo que habíamos comprado
            producto.setStock(producto.getStock().subtract(cantidadARestar));
        }
        compraRepository.delete(compra);
        log.info("Compra con ID {} eliminada exitosamente. Stock revertido.", id);
    }

    // --- LISTAR CON PAGINACIÓN ---
    public Page<CompraResponseDTO> findAll(Pageable pageable) {
        // El repository ya sabe recibir un Pageable y devolver un Page<Compra>
        return compraRepository.findAll(pageable)
                .map(this::mapToDTO); // Mapeamos cada compra a tu DTO de respuesta
    }

    private CompraResponseDTO mapToDTO(Compra compra) {
        // Transformamos los detalles en la lista de ProductoResponseCompraDTO
        List<ProductoResponseCompraDTO> productosResponse = compra.getDetalles().stream()
                .map(detalle -> ProductoResponseCompraDTO.builder()
                        .id(detalle.getProducto().getId())
                        .nombre(detalle.getProducto().getNombre())
                        .build())
                .collect(Collectors.toList());

        return CompraResponseDTO.builder()
                .id(compra.getId())
                .proveedorNombre(compra.getProveedor().getNombre())
                .totalCompra(compra.getTotalCompra())
                .fechaCompra(compra.getFechaCompra())
                .productos(productosResponse)
                .build();
    }
}