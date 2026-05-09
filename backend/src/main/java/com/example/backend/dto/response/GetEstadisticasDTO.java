package com.example.backend.dto.response;
import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetEstadisticasDTO {
    private BigDecimal ingresosMensuales;
    private BigDecimal gastosMensuales;
    private BigDecimal gananciasMensuales;
    private BigDecimal promedioGananciasMensuales;
}