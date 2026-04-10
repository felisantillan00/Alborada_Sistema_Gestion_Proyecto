package com.example.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetEstadisticasDTO {
    private BigDecimal ingresosSemestrales;
    private BigDecimal gastosSemestrales;
    private BigDecimal gananciasSemestrales;
    private BigDecimal promedioGananciasSemestrales;
}
