package com.example.backend.dto.response;

import java.math.BigDecimal;

public record DetalleVentaResponseDTO(
    Long id,
    Long idProducto,
    String nombreProducto,
    Integer cantidad,
    BigDecimal precioUnitario,
    BigDecimal subtotal
) {}