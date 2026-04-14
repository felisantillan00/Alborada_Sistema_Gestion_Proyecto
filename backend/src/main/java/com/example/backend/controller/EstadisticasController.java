package com.example.backend.controller;

import com.example.backend.dto.response.GetEstadisticasDTO;
import com.example.backend.dto.response.MetricaMensualDTO;
import com.example.backend.dto.response.PieChartDTO;
import com.example.backend.service.EstadisticasService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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