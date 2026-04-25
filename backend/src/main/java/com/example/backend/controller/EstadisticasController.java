package com.example.backend.controller;
import com.example.backend.service.EstadisticasService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.backend.dto.response.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/estadisticas")
@RequiredArgsConstructor
@Slf4j
public class EstadisticasController {
    private final EstadisticasService estadisticasService;

    @GetMapping
    public ResponseEntity<GetEstadisticasDTO> getEstadisticas() {
        return ResponseEntity.ok(estadisticasService.getEstadisticasMesActual());
    }

    @GetMapping("/pie")
    public ResponseEntity<PieChartDTO> getPieChart() {
        return ResponseEntity.ok(estadisticasService.getPieChartDatos());
    }

    @GetMapping("/reparaciones-mensuales")
    public ResponseEntity<List<MetricaMensualDTO>> getReparacionesMensuales() {
        return ResponseEntity.ok(estadisticasService.getReparacionesUltimosSeisMeses());
    }

    @GetMapping("/ventas-mensuales")
    public ResponseEntity<List<MetricaMensualDTO>> getVentasMensuales() {
        return ResponseEntity.ok(estadisticasService.getVentasUltimosSeisMeses());
    }

    @GetMapping("/compras-mensuales")
    public ResponseEntity<List<MetricaMensualDTO>> getComprasMensuales() {
        return ResponseEntity.ok(estadisticasService.getComprasUltimosSeisMeses());
    }
}