package com.example.backend.service;

import com.example.backend.dto.response.GetEstadisticasDTO;
import com.example.backend.dto.response.MetricaMensualDTO;
import com.example.backend.dto.response.PieChartDTO;
import com.example.backend.repository.CompraRepository;
import com.example.backend.repository.OrdenServicioRepository;
import com.example.backend.repository.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EstadisticasService {

    private final VentaRepository ventaRepository;
    private final OrdenServicioRepository ordenServicioRepository;
    private final CompraRepository compraRepository;

    public GetEstadisticasDTO getEstadisticasMesActual() {
        int mes = LocalDate.now().getMonthValue();
        int anio = LocalDate.now().getYear();

        //Cuanta plata entro este mes
        BigDecimal ingresosVentas = ventaRepository.sumVentasPorMes(mes, anio);
        BigDecimal ingresosReparaciones = ordenServicioRepository.sumReparacionesEntregadasPorMes(mes, anio);
        
        if(ingresosVentas == null) ingresosVentas = BigDecimal.ZERO;
        if(ingresosReparaciones == null) ingresosReparaciones = BigDecimal.ZERO;
        
        //Ingresos mensuales = ventas + reparaciones
        BigDecimal ingresosMensuales = ingresosVentas.add(ingresosReparaciones);
        
        //Cuanta plata salio (gastos)
        BigDecimal gastosMensuales = compraRepository.sumComprasPorMes(mes, anio);
        if(gastosMensuales == null) gastosMensuales = BigDecimal.ZERO;

        //Ganancia neta = Ingresos - Gastos
        BigDecimal gananciasMensuales = ingresosMensuales.subtract(gastosMensuales);
        
        // CORRECCIÓN 1: Promedio = Ganancia Total / Día actual del mes (getDayOfMonth)
        BigDecimal promedioGananciasMensuales = gananciasMensuales.divide(new BigDecimal(LocalDate.now().getDayOfMonth()), 2, RoundingMode.HALF_UP);

        return GetEstadisticasDTO.builder()
                .ingresosMensuales(ingresosMensuales)
                .gastosMensuales(gastosMensuales)
                .gananciasMensuales(gananciasMensuales)
                .promedioGananciasMensuales(promedioGananciasMensuales)
                .build();
    }

    public PieChartDTO getPieChartDatos() {  //Para "pie" de comparacion entre ventas y reparaciones
        BigDecimal totalVentas = ventaRepository.sumTotalVentas();
        BigDecimal totalReparaciones = ordenServicioRepository.sumTotalOrdenesEntregadas();

        return PieChartDTO.builder()
                .totalVentas(totalVentas != null ? totalVentas : BigDecimal.ZERO)
                .totalReparaciones(totalReparaciones != null ? totalReparaciones : BigDecimal.ZERO)
                .build();
    }

    public List<MetricaMensualDTO> getReparacionesUltimosSeisMeses() { //Para grafico de comparacion entre reparaciones de los ultimos 6 meses
        LocalDate seisMesesAtras = LocalDate.now().minusMonths(6);
        List<Object[]> resultados = ordenServicioRepository.countReparacionesAgrupadasPorMes(seisMesesAtras);
        return mapearResultados(resultados);
    }

    public List<MetricaMensualDTO> getVentasUltimosSeisMeses() { //Para grafico de comparacion entre ventas de los ultimos 6 meses
        LocalDate seisMesesAtras = LocalDate.now().minusMonths(6);
        List<Object[]> resultados = ventaRepository.obtenerVentasAgrupadasPorMes(seisMesesAtras);
        return mapearResultados(resultados);
    }

    public List<MetricaMensualDTO> getComprasUltimosSeisMeses() { //Para grafico de comparacion entre compras de los ultimos 6 meses
        LocalDate seisMesesAtras = LocalDate.now().minusMonths(6);
        List<Object[]> resultados = compraRepository.obtenerComprasAgrupadasPorMes(seisMesesAtras);
        return mapearResultados(resultados);
    }

    // Función para transformar el dato SQL[4, 1500] en { mes: "abril", total: 1500 }
    private List<MetricaMensualDTO> mapearResultados(List<Object[]> resultados) { 
        List<MetricaMensualDTO> listaFinal = new ArrayList<>();
        for (Object[] fila : resultados) {
            int numeroMes = (Integer) fila[0];
            
            //El total puede ser null si no hubo ventas/reparaciones/compras en ese mes, así que lo manejamos con un ternario
            BigDecimal total = (fila[1] != null) ? new BigDecimal(fila[1].toString()) : BigDecimal.ZERO;
            
            // Obtiene el nombre del mes en español
            String nombreMes = java.time.Month.of(numeroMes)
                    .getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
            
            listaFinal.add(new MetricaMensualDTO(nombreMes, total));
        }
        return listaFinal;
    }
}