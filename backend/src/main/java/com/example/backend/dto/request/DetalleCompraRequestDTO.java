package com.example.backend.dto.request;

import java.math.BigDecimal;

public record DetalleCompraRequestDTO(
    ProductoIdDTO producto,   // Ataja el JSON anidado: { "id": X }
    Integer cantidad,
    BigDecimal precioCompra      
) {}