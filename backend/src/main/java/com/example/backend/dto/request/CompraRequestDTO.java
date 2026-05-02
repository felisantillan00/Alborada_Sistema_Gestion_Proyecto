package com.example.backend.dto.request;
import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CompraRequestDTO(
    @Positive(message = "El ID del proveedor es obligatorio")
    @NotNull(message = "El ID del proveedor es obligatorio")
    Long idProveedor,   //se debe validar que exista un proveedor con ese ID

    String formaPago,

    @NotEmpty(message = "La lista de detalles no puede estar vacía")
    @Valid //Le dice a Spring que también valide por dentro cada detalle
    List<DetalleCompraRequestDTO> detalles
) {}