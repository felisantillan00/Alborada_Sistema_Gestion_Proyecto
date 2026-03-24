package com.example.backend.dto.request;


public record DetalleCompraRequestDTO(
    ProductoIdDTO producto,   // Ataja el JSON anidado: { "id": X }
    Integer cantidad,
    Double precioCompra      
) {}