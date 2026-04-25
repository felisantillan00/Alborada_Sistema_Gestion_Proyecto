package com.example.backend.dto.response;
import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PieChartDTO {
    private BigDecimal totalVentas;
    private BigDecimal totalReparaciones;
}