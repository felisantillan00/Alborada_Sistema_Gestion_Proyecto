package com.example.backend.service;

import com.example.backend.dto.request.DetalleVentaRequestDTO;
import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.DetalleVentaResponseDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.model.DetalleVenta;
import com.example.backend.model.FormaPago;
import com.example.backend.model.Producto;
import com.example.backend.model.Venta;
import com.example.backend.repository.ProductoRepository;
import com.example.backend.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    // Traemos las llaves de los archiveros (Repositorios)
    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    // @Transactional es vital: si algo falla en el medio (ej. no hay stock), cancela todo y no guarda datos a medias.
    @Transactional
    public VentaResponseDTO registrarVenta(VentaRequestDTO request) {
        
        // 1. Preparamos la Venta en blanco
        Venta nuevaVenta = new Venta();
        nuevaVenta.setFechaVenta(LocalDateTime.now());
        nuevaVenta.setNombreCliente(request.nombreCliente());
        nuevaVenta.setObservacion(request.observacion());
        nuevaVenta.setFormaPago(FormaPago.valueOf(request.formaPago().toUpperCase()));
        
        List<DetalleVenta> detallesVenta = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        // 2. Revisamos cada producto que el cliente quiere llevarse
        for (DetalleVentaRequestDTO detalleRequest : request.detalles()) {
            
            // Buscamos el producto en la base de datos usando el código de tu compañero
            Producto producto = productoRepository.findById(detalleRequest.idProducto())
                    .orElseThrow(() -> new RuntimeException("Error: Producto no encontrado"));

            // 3. ¡VALIDACIÓN DE STOCK! (Requisito estricto de tu Hito)
            if (producto.getStock() < detalleRequest.cantidad()) {
                throw new RuntimeException("Error: No hay stock suficiente para " + producto.getNombre());
            }

            // 4. RESTAR STOCK (Actualizamos el inventario)
            producto.setStock(producto.getStock() - detalleRequest.cantidad());
            productoRepository.save(producto);

            // 5. CÁLCULOS: Multiplicamos el precio real del producto por la cantidad
            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(detalleRequest.cantidad()));
            totalVenta = totalVenta.add(subtotal); // Sumamos al total de la factura

            // Armamos el detalle individual
            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setVenta(nuevaVenta);
            detalle.setCantidad(detalleRequest.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setTotal(subtotal);

            detallesVenta.add(detalle);
        }

        // 6. Guardamos la Venta final con todos sus detalles (La cascada hace su magia aquí)
        nuevaVenta.setDetalles(detallesVenta);
        nuevaVenta.setTotal(totalVenta);
        Venta ventaGuardada = ventaRepository.save(nuevaVenta);

        // 7. Armamos el "ticket" de respuesta (ResponseDTO) para devolverle al Frontend
        return mapearAVentaResponse(ventaGuardada);
    }

    // --- Método auxiliar para traducir de Entidad a DTO de salida ---
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