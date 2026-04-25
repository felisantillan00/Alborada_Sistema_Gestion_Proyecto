package com.example.backend.service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.example.backend.enums.FormaPago;
import com.example.backend.dto.response.*;
import com.example.backend.dto.request.*;
import com.example.backend.repository.*;
import org.springframework.data.domain.*;
import lombok.RequiredArgsConstructor;
import com.example.backend.model.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor 
public class VentaService {
    private final VentaRepository ventaRepository;
    private final ProductoService productoService; 
    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public Page<VentaResponseDTO> findAll(Pageable pageable) {
        return ventaRepository.findAll(pageable)
                .map(this::mapearAVentaResponse);
    }

    @Transactional
    public VentaResponseDTO create(VentaRequestDTO request) {
        Venta nuevaVenta = new Venta();
        nuevaVenta.setFechaVenta(LocalDateTime.now());
        nuevaVenta.setNombreCliente(request.nombreCliente());
        nuevaVenta.setObservacion(request.observacion());
        
        try {
            nuevaVenta.setFormaPago(FormaPago.valueOf(request.formaPago().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Forma de pago no válida: " + request.formaPago());
        }
        
        //Se obtienen los IDs de los productos de los detalles de la venta
        //Busco todos los productos en una sola consulta a la BDD para optimizar el rendimiento
        List<Long> productoIds = request.detalles().stream()
                .map(DetalleVentaRequestDTO::idProducto)
                .toList();

        Map<Long, Producto> productosMap = productoRepository.findAllById(productoIds).stream()
                .collect(Collectors.toMap(Producto::getId, producto -> producto));

        if (productoIds.size() != productosMap.size()) {
            throw new RuntimeException("Uno o más productos no fueron encontrados en la base de datos.");
        }

        List<DetalleVenta> detallesVenta = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        for (DetalleVentaRequestDTO detalleRequest : request.detalles()) {
            Producto producto = productosMap.get(detalleRequest.idProducto());
            BigDecimal cantidadBD = BigDecimal.valueOf(detalleRequest.cantidad());
            productoService.descontarStock(producto.getId(), cantidadBD);

            BigDecimal subtotal = producto.getPrecioVenta().multiply(cantidadBD);
            totalVenta = totalVenta.add(subtotal);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto); 
            detalle.setVenta(nuevaVenta);
            detalle.setCantidad(detalleRequest.cantidad());
            detalle.setPrecioUnitario(producto.getPrecioVenta());
            detalle.setTotal(subtotal);

            detallesVenta.add(detalle);
        }

        nuevaVenta.setDetalles(detallesVenta);
        nuevaVenta.setTotal(totalVenta);
        
        Venta ventaGuardada = ventaRepository.save(nuevaVenta);
        return mapearAVentaResponse(ventaGuardada);
    }

    @Transactional
    public VentaResponseDTO update(Long id, VentaRequestDTO request) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));

        venta.setNombreCliente(request.nombreCliente());
        venta.setObservacion(request.observacion());
        
        try {
            venta.setFormaPago(FormaPago.valueOf(request.formaPago().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Forma de pago no válida: " + request.formaPago());
        }

        // 1. Reponer el stock de los detalles viejos y desvincularlos
        for (DetalleVenta detalleViejo : venta.getDetalles()) {
            Producto productoViejo = detalleViejo.getProducto();
            BigDecimal cantidadAReponer = BigDecimal.valueOf(detalleViejo.getCantidad());
            productoViejo.setStock(productoViejo.getStock().add(cantidadAReponer));
            productoRepository.save(productoViejo);
            detalleViejo.setVenta(null);
        }

        // 2. Limpiar la lista actual de detalles
        venta.getDetalles().clear();
        ventaRepository.flush(); // Forzamos la sincronización con la BD

        // 3. Obtener y mapear los nuevos productos de la request
        List<Long> productoIds = request.detalles().stream()
                .map(DetalleVentaRequestDTO::idProducto)
                .toList();

        Map<Long, Producto> productosMap = productoRepository.findAllById(productoIds).stream()
                .collect(Collectors.toMap(Producto::getId, producto -> producto));

        if (productoIds.size() != productosMap.size()) {
            throw new RuntimeException("Uno o más productos no fueron encontrados en la base de datos.");
        }

        BigDecimal totalVenta = BigDecimal.ZERO;
        
        // 4. Armar los nuevos detalles y descontar stock
        for (DetalleVentaRequestDTO detalleRequest : request.detalles()) {
            Producto producto = productosMap.get(detalleRequest.idProducto());
            BigDecimal cantidadBD = BigDecimal.valueOf(detalleRequest.cantidad());
            
            productoService.descontarStock(producto.getId(), cantidadBD); // Validamos y descontamos stock

            BigDecimal subtotal = producto.getPrecioVenta().multiply(cantidadBD);
            totalVenta = totalVenta.add(subtotal);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setVenta(venta);
            detalle.setCantidad(detalleRequest.cantidad());
            detalle.setPrecioUnitario(producto.getPrecioVenta());
            detalle.setTotal(subtotal);

            venta.getDetalles().add(detalle);
        }

        venta.setTotal(totalVenta);
        
        return mapearAVentaResponse(ventaRepository.save(venta));
    }

    @Transactional
    public void delete(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));

        // Reponer stock al inventario antes de borrar la venta
        for (DetalleVenta detalle : venta.getDetalles()) {
            Producto producto = detalle.getProducto();
            BigDecimal cantidadAReponer = BigDecimal.valueOf(detalle.getCantidad());
            producto.setStock(producto.getStock().add(cantidadAReponer));
            productoRepository.save(producto);
        }

        ventaRepository.delete(venta);
    }

    private VentaResponseDTO mapearAVentaResponse(Venta venta) {
        List<DetalleVentaResponseDTO> detallesDTO = venta.getDetalles().stream()
                .map(d -> new DetalleVentaResponseDTO(
                        d.getId(),
                        d.getProducto().getId(),
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getTotal()
                )).toList();

        return new VentaResponseDTO(
                venta.getId(),
                venta.getTotal(),
                venta.getFormaPago().name(),
                venta.getObservacion(),
                venta.getNombreCliente(),
                venta.getFechaVenta(),
                detallesDTO
        );
    }
}