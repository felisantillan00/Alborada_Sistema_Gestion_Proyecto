package com.example.backend.dto.response;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraResponseDTO {
    private Long id;
    private List<ProductoResponseCompraDTO> producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private String nombreprovedor;
}
