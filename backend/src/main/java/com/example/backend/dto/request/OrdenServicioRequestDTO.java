package com.example.backend.dto.request;
import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.math.BigDecimal;

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