package com.example.backend.dto.request;
import java.math.BigDecimal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrdenServicioRequestDTO( 
    @NotBlank(message = "El nombre del cliente es obligatorio")
    String nombreCliente,
    String observacion,
    
    @NotNull(message = "El valor de la mano de obra es obligatorio")
    @Positive(message = "El valor de la mano de obra debe ser mayor a 0")
    BigDecimal valorManoDeObra,

    @NotEmpty(message = "La lista de detalles no puede estar vacía")
    @Valid //Le dice a Spring que también valide por dentro cada detalle
    DetalleOrdenServicioRequestDTO[] detalles
) {}
