package com.example.backend.dto.request;
import java.math.BigDecimal;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequestDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precioCosto; 
    private BigDecimal precioVenta;
    private BigDecimal stock;
    private BigDecimal stockMinimo;
    private BigDecimal margenGanancia;
    private Long idCategoria; 
    private Long idMarca;
    private Long idProveedor;
}