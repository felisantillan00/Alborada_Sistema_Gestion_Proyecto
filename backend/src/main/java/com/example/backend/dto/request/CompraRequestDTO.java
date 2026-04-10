package com.example.backend.dto.request;
import java.math.BigDecimal;
import java.util.List;

public record CompraRequestDTO(
    Long id,                  // para ediciones, se debe omitir en creaciones
    String proveedorNombre,   //se debe validar que exista un proveedor con ese nombre
    BigDecimal totalCompra,       // validar que sea igual a la suma de los subtotales de los detalles
    List<DetalleCompraRequestDTO> detalles
) {}