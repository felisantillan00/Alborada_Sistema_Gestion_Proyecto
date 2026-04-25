package com.example.backend.dto.request;
import jakarta.validation.constraints.*;

public record DetalleOrdenServicioRequestDTO(
    @NotNull(message = "El id del producto es obligatorio")
    Long id,

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a 0")
    Integer cantidad
) {}