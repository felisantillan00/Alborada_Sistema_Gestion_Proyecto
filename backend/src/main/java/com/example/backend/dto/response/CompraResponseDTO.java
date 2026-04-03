package com.example.backend.dto.response;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompraResponseDTO {
    private Long id;
    private List<ProductoResponseCompraDTO> productos;
    private BigDecimal totalCompra;
    private String proveedorNombre;
    private LocalDateTime fechaCompra;

}
