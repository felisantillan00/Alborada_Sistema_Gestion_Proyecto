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

    // --- 1. CREATE ---
    public CompraResponseDTO create(CompraRequestDTO request) {
        log.info("Iniciando registro de compra para el proveedor: {}", request.proveedorNombre());

        if (request.detalles() == null || request.detalles().isEmpty()) {
            throw new NegocioException("La compra debe tener al menos un producto detallado.");
        }

        Proveedor proveedor = proveedorRepository.findByNombre(request.proveedorNombre())
                .orElseThrow(() -> new NegocioException("Proveedor no encontrado con nombre: " + request.proveedorNombre()));

        Compra nuevaCompra = new Compra();
        nuevaCompra.setProveedor(proveedor);
        nuevaCompra.setFechaCompra(LocalDateTime.now());

        int cantidadTotal = request.detalles().stream()
                .mapToInt(DetalleCompraRequestDTO::cantidad)
                .sum();
        nuevaCompra.setCantidadTotal(cantidadTotal);

        BigDecimal totalCalculado = BigDecimal.ZERO;
        List<DetalleCompra> detallesEntidad = new ArrayList<>();

        for (DetalleCompraRequestDTO detalleDTO : request.detalles()) {
            
            Producto producto = productoRepository.findById(detalleDTO.producto().id())
                    .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + detalleDTO.producto().id()));

            if (detalleDTO.cantidad() <= 0) {
                throw new NegocioException("La cantidad a comprar debe ser mayor a cero.");
            }

            BigDecimal precioUnitarioAUsar;
            
            if (detalleDTO.precioCompra() != null) {
                precioUnitarioAUsar = detalleDTO.precioCompra();
            } else {
                if (producto.getPrecioCosto() == null) {
                    throw new NegocioException("El producto '" + producto.getNombre() + "' no tiene un precio registrado en el sistema. Debe ingresarlo manualmente.");
                }
                precioUnitarioAUsar = producto.getPrecioCosto(); 
            }
            
            // --- A. ACTUALIZAMOS STOCK ---
            BigDecimal cantidadComprada = BigDecimal.valueOf(detalleDTO.cantidad());
            producto.setStock(producto.getStock().add(cantidadComprada));

            // --- B. ACTUALIZAMOS PRECIOS Y PROVEEDOR ---
            producto.setProveedor(proveedor); 
            producto.setPrecioCosto(precioUnitarioAUsar);
            
            if (producto.getMargenGanancia() != null && producto.getMargenGanancia().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal ganancia = precioUnitarioAUsar
                        .multiply(producto.getMargenGanancia())
                        .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                
                producto.setPrecioVenta(precioUnitarioAUsar.add(ganancia));
            } 
        
            // --- C. ARMAMOS EL DETALLE ---
            BigDecimal subtotal = precioUnitarioAUsar.multiply(cantidadComprada); 
            totalCalculado = totalCalculado.add(subtotal);

            DetalleCompra nuevoDetalle = new DetalleCompra();
            nuevoDetalle.setProducto(producto);
            nuevoDetalle.setCantidad(detalleDTO.cantidad());
            nuevoDetalle.setPrecioUnitario(precioUnitarioAUsar); 
            nuevoDetalle.setSubtotal(subtotal);
            
            nuevoDetalle.setCompra(nuevaCompra); 
            detallesEntidad.add(nuevoDetalle);
        }

        if (request.totalCompra() != null) {
            if (totalCalculado.compareTo(request.totalCompra()) != 0) {
                throw new NegocioException(
                    String.format("El total enviado (%s) no coincide con la suma real de los subtotales (%s)", 
                    request.totalCompra(), totalCalculado)
                );
            }
        }

        nuevaCompra.setDetalles(detallesEntidad);
        nuevaCompra.setTotalCompra(totalCalculado);

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

    // --- 4. UPDATE --- 
    public CompraResponseDTO update(Long id, CompraRequestDTO request) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Compra no encontrada con ID: " + id));

        if (request.proveedorNombre() != null && !request.proveedorNombre().isBlank()) {
            Proveedor proveedor = proveedorRepository.findByNombre(request.proveedorNombre())
                    .orElseThrow(() -> new NegocioException("Proveedor no encontrado con nombre: " + request.proveedorNombre()));
            compra.setProveedor(proveedor);
        }

        if (request.detalles() != null && !request.detalles().isEmpty()) {
            
            for (DetalleCompra detalleViejo : compra.getDetalles()) {
                Producto productoViejo = detalleViejo.getProducto();
                BigDecimal cantidadARestar = BigDecimal.valueOf(detalleViejo.getCantidad());
                
                productoViejo.setStock(productoViejo.getStock().subtract(cantidadARestar));
                detalleViejo.setCompra(null); 
            }

            compra.getDetalles().clear();
            compraRepository.flush();

            // CORRECCIÓN: Inicializamos en BigDecimal.ZERO
            BigDecimal nuevoTotalCalculado = BigDecimal.ZERO;
            
            int nuevaCantidadTotal = request.detalles().stream()
                .mapToInt(DetalleCompraRequestDTO::cantidad)
                .sum();
            compra.setCantidadTotal(nuevaCantidadTotal);
            
            Proveedor proveedorActual = compra.getProveedor(); 
            
            for (DetalleCompraRequestDTO detalleNuevoDTO : request.detalles()) {
                Producto productoNuevo = productoRepository.findById(detalleNuevoDTO.producto().id())
                        .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + detalleNuevoDTO.producto().id()));

                if (detalleNuevoDTO.cantidad() <= 0) {
                    throw new NegocioException("La cantidad debe ser mayor a cero.");
                }

                BigDecimal precioUnitarioAUsar;
                
                if (detalleNuevoDTO.precioCompra() != null) {
                    precioUnitarioAUsar = detalleNuevoDTO.precioCompra();
                } else {
                    if (productoNuevo.getPrecioCosto() == null) {
                        throw new NegocioException("El producto '" + productoNuevo.getNombre() + "' no tiene un precio registrado. Debe ingresarlo.");
                    }
                    precioUnitarioAUsar = productoNuevo.getPrecioCosto();
                }

                BigDecimal cantidadASumar = BigDecimal.valueOf(detalleNuevoDTO.cantidad());
                productoNuevo.setStock(productoNuevo.getStock().add(cantidadASumar));

                productoNuevo.setProveedor(proveedorActual);
                productoNuevo.setPrecioCosto(precioUnitarioAUsar);
                
                if (productoNuevo.getMargenGanancia() != null && productoNuevo.getMargenGanancia().compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal ganancia = precioUnitarioAUsar
                            .multiply(productoNuevo.getMargenGanancia())
                            .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                    
                    productoNuevo.setPrecioVenta(precioUnitarioAUsar.add(ganancia));
                }

                // CORRECCIÓN: Usamos cantidadASumar directamente sin valueOf porque ya es un BigDecimal
                BigDecimal subtotal = cantidadASumar.multiply(precioUnitarioAUsar);
                nuevoTotalCalculado = nuevoTotalCalculado.add(subtotal);

                DetalleCompra nuevoDetalle = new DetalleCompra();
                nuevoDetalle.setProducto(productoNuevo);
                nuevoDetalle.setCantidad(detalleNuevoDTO.cantidad());
                nuevoDetalle.setPrecioUnitario(precioUnitarioAUsar);
                nuevoDetalle.setSubtotal(subtotal);
                nuevoDetalle.setCompra(compra);

                compra.getDetalles().add(nuevoDetalle);
            }

            // CORRECCIÓN: Reemplazamos el Math.abs por compareTo
            if (request.totalCompra() != null) {
                if (nuevoTotalCalculado.compareTo(request.totalCompra()) != 0) {
                    throw new NegocioException(
                    String.format("El total enviado (%s) no coincide con la suma real de los subtotales (%s)", 
                    request.totalCompra(), nuevoTotalCalculado)
                    );
                }
            }       
            compra.setTotalCompra(nuevoTotalCalculado);
        }

        Compra actualizada = compraRepository.save(compra);
        return mapToDTO(actualizada);
    }

    // --- 5. DELETE ---
    public void delete(Long id) {
        log.info("Iniciando borrado de compra con ID: {}", id);

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Compra no encontrada con ID: " + id));

        for (DetalleCompra detalle : compra.getDetalles()) {
            Producto producto = detalle.getProducto();
            BigDecimal cantidadARestar = BigDecimal.valueOf(detalle.getCantidad());
            
            if (producto.getStock().compareTo(cantidadARestar) < 0) {
                throw new NegocioException(
                    String.format("No se puede borrar la compra. El producto '%s' quedaría con stock negativo (%s unidades disponibles).", 
                    producto.getNombre(), producto.getStock())
                );
            }
            
            producto.setStock(producto.getStock().subtract(cantidadARestar));
        }
        compraRepository.delete(compra);
        log.info("Compra con ID {} eliminada exitosamente. Stock revertido.", id);
    }

    // --- LISTAR CON PAGINACIÓN ---
    public Page<CompraResponseDTO> findAll(Pageable pageable) {
        return compraRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    private CompraResponseDTO mapToDTO(Compra compra) {
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