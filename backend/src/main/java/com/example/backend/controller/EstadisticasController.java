package com.example.backend.controller;

import com.example.backend.dto.ReparacionPorMesDTO;
import com.example.backend.dto.response.GetEstadisticasDTO;
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
        log.info("Obteniendo estadísticas semestrales");
        return ResponseEntity.ok(estadisticasService.getEstadisticasSemestrales());
    }

    @GetMapping("/reparaciones-por-mes")
    public ResponseEntity<List<ReparacionPorMesDTO>> getReparacionesPorMes() {
        log.info("Obteniendo reparaciones agrupadas por mes de los últimos seis meses");
        return ResponseEntity.ok(estadisticasService.getReparacionesPorMesUltimosSeisMeses());
    }
}
