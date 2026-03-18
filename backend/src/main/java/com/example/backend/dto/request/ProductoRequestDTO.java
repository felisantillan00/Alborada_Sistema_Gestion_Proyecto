package com.example.backend.dto.request;
import java.math.BigDecimal;

public record ProductoRequestDTO (
    Long id,
    String nombre,
    String descripcion,
    BigDecimal precioCosto,
    BigDecimal precioVenta,
    BigDecimal stock,
    BigDecimal stockMinimo,
    BigDecimal margenGanancia,
    Long idCategoria,
    Long idMarca,
    Long idProveedor
) {}