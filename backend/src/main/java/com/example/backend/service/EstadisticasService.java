package com.example.backend.service;

import com.example.backend.dto.ReparacionPorMesDTO;
import com.example.backend.dto.response.GetEstadisticasDTO;
import com.example.backend.repository.CompraRepository;
import com.example.backend.repository.OrdenServicioRepository;
import com.example.backend.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadisticasService {

    private final VentaRepository ventaRepository;
    private final OrdenServicioRepository ordenServicioRepository;
    private final CompraRepository compraRepository;

    public GetEstadisticasDTO getEstadisticasSemestrales() {
        LocalDateTime seisMesesAtras = LocalDateTime.now().minusMonths(6);

        BigDecimal ingresosVentas = ventaRepository.sumTotalVentasUltimosSeisMeses(seisMesesAtras);
        BigDecimal ingresosOrdenes = ordenServicioRepository.sumTotalOrdenesServicioEntregadasUltimosSeisMeses(seisMesesAtras);

        BigDecimal ingresosSemestrales = ingresosVentas.add(ingresosOrdenes);
        BigDecimal gastosSemestrales = compraRepository.sumTotalComprasUltimosSeisMeses(seisMesesAtras);

        BigDecimal gananciasSemestrales = ingresosSemestrales.subtract(gastosSemestrales);

        BigDecimal promedioGananciasSemestrales = gananciasSemestrales.divide(new BigDecimal("6"), 2, RoundingMode.HALF_UP);

        return GetEstadisticasDTO.builder()
                .ingresosSemestrales(ingresosSemestrales)
                .gastosSemestrales(gastosSemestrales)
                .gananciasSemestrales(gananciasSemestrales)
                .promedioGananciasSemestrales(promedioGananciasSemestrales)
                .build();
    }

    public List<ReparacionPorMesDTO> getReparacionesPorMesUltimosSeisMeses() {
        LocalDateTime seisMesesAtras = LocalDateTime.now().minusMonths(6);
        return ordenServicioRepository.countReparacionesPorMes(seisMesesAtras);
    }
}
