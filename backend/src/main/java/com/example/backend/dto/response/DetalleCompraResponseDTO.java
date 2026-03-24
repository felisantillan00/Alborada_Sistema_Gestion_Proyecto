package com.example.backend.dto.response;
import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraResponseDTO {
    private Long id;
    private List<ProductoResponseCompraDTO> producto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
    private String nombreprovedor;
}
