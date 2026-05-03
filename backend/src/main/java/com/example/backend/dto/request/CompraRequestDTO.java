package com.example.backend.dto.request;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.util.List;

public record CompraRequestDTO(
    @Positive(message = "El ID del proveedor es obligatorio")
    @NotNull(message = "El ID del proveedor es obligatorio")
    Long idProveedor,   //se debe validar que exista un proveedor con ese ID

    String formaPago,

    @NotEmpty(message = "La lista de detalles no puede estar vacía")
    @Valid //Le dice a Spring que también valide por dentro cada detalle
    List<DetalleCompraRequestDTO> detalles
) {}