package com.example.backend.dto.response;
import java.math.BigDecimal;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetalleOrdenServicioResponseDTO {
    private Long idProducto;
    private String nombreProducto;
    private BigDecimal valorVenta;
    private Integer cantidad;
}
