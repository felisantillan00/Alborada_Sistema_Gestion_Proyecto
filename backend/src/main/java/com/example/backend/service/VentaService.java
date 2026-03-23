package com.example.backend.service;

import com.example.backend.dto.request.DetalleVentaRequestDTO;
import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.DetalleVentaResponseDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.ProductoRepository;
import com.example.backend.repository.VentaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor 
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoService productoService; 
    private final ProductoRepository productoRepository; //Repo para buscar los productos rápido

    //Listar ventas con paginación
    @Transactional(readOnly = true)
    public Page<VentaResponseDTO> listarVentas(Pageable pageable) {
        return ventaRepository.findAll(pageable)
                .map(this::mapearAVentaResponse);
    }

    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO request) {
        
        Venta nuevaVenta = new Venta();
        nuevaVenta.setFechaVenta(LocalDateTime.now());
        nuevaVenta.setNombreCliente(request.nombreCliente());
        nuevaVenta.setObservacion(request.observacion());
        
        try {
            nuevaVenta.setFormaPago(FormaPago.valueOf(request.formaPago().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Forma de pago no válida: " + request.formaPago());
        }
        
        //1. Busco todos los productos de una sola vez para optimizar 
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
            
            //2. Obtengo el producto real desde el mapa que ya buscamos
            Producto producto = productosMap.get(detalleRequest.idProducto());
            
            //3. Convierto la cantidad y descuento stock usando el servicio de producto
            BigDecimal cantidadBD = BigDecimal.valueOf(detalleRequest.cantidad());
            productoService.descontarStock(producto.getId(), cantidadBD);

            //4. Subtotal
            BigDecimal subtotal = producto.getPrecioVenta().multiply(cantidadBD);
            totalVenta = totalVenta.add(subtotal);

            //5. Se crea el objeto DetalleVenta pasando la Entidad real
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