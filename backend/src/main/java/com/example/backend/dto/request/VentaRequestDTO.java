package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record VentaRequestDTO(
    
    @NotBlank(message = "La forma de pago es obligatoria")
    String formaPago,

    String observacion,

    @NotBlank(message = "El nombre del cliente es obligatorio")
    String nombreCliente,

    @NotEmpty(message = "La venta debe tener al menos un detalle")
    List<DetalleVentaRequestDTO> detalles
) {}