package com.example.backend.dto.response;
import java.math.BigDecimal;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioCosto;
    private BigDecimal precioVenta;
    private BigDecimal stock;
    private String nombreCategoria;
    private String nombreMarca;
    private String nombreProveedor;
}