package com.example.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DetalleVentaRequestDTO(
    @NotNull(message = "El ID del producto es obligatorio")
    Long idProducto,

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a cero")
    Integer cantidad
) {}