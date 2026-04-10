package com.example.backend.dto.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DetalleOrdenServicioRequestDTO(
    @NotNull(message = "El id del producto es obligatorio")
    Long idProducto,

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a 0")
    Integer cantidad

) {}