package com.example.backend.dto.response;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

public record VentaResponseDTO(
    Long id,
    BigDecimal total,
    String formaPago,
    String observacion,
    String nombreCliente,
    LocalDateTime fechaVenta,
    List<DetalleVentaResponseDTO> detalles
) {}