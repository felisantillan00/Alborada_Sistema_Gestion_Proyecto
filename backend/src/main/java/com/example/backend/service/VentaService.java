package com.example.backend.service;

import com.example.backend.dto.request.DetalleVentaRequestDTO;
import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.DetalleVentaResponseDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.model.*;
import com.example.backend.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor // Esto hace que el constructor se cree solo
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoService productoService; // Usamos el servicio del compañero

    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO request) {
        
        Venta nuevaVenta = new Venta();
        nuevaVenta.setFechaVenta(LocalDateTime.now());
        nuevaVenta.setNombreCliente(request.nombreCliente());
        nuevaVenta.setObservacion(request.observacion());
        nuevaVenta.setFormaPago(FormaPago.valueOf(request.formaPago().toUpperCase()));
        
        List<DetalleVenta> detallesVenta = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        for (DetalleVentaRequestDTO detalleRequest : request.detalles()) {
            
            // 1. Usamos el método de tu compañero que ya descuenta stock y valida todo
            // Convertimos la cantidad a BigDecimal porque así lo pide su método
            BigDecimal cantidadBD = BigDecimal.valueOf(detalleRequest.cantidad());
            productoService.descontarStock(detalleRequest.idProducto(), cantidadBD);

            // 2. Buscamos el producto para obtener el precio actual
            // (Tu compañero ya tiene un método findById en su service)
            var productoDto = productoService.findById(detalleRequest.idProducto());
            
            // 3. Calculamos subtotal
            BigDecimal subtotal = productoDto.getPrecioVenta().multiply(cantidadBD);
            totalVenta = totalVenta.add(subtotal);

            // 4. Creamos el objeto DetalleVenta
            DetalleVenta detalle = new DetalleVenta();
            // Nota: Aquí creamos una entidad mínima de producto para la relación
            Producto p = new Producto();
            p.setId(productoDto.getId());
            
            detalle.setProducto(p);
            detalle.setVenta(nuevaVenta);
            detalle.setCantidad(detalleRequest.cantidad());
            detalle.setPrecioUnitario(productoDto.getPrecioVenta());
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