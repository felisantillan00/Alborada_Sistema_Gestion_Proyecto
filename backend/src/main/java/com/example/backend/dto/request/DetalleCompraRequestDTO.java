package com.example.backend.dto.request;
import java.math.BigDecimal;
import jakarta.validation.constraints.*;

public record DetalleCompraRequestDTO(
    
    @NotNull(message = "El id del producto es obligatorio")
    @Positive(message = "El id del producto debe ser un número positivo")
    Long idProducto,   //se debe validar que exista un producto con ese ID
    
    @Positive(message = "El precio de compra debe ser un número positivo")
    @NotNull(message = "El precio de compra es obligatorio")  
    BigDecimal precioCompra,

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser un número positivo")
    Integer cantidad
) {}