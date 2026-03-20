package com.example.backend.controller;

import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") 

public class VentaController {
    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<VentaResponseDTO> registrarVenta(@RequestBody VentaRequestDTO request) {
        // Recibe el JSON del frontend y lo manda a tu Service
        VentaResponseDTO respuesta = ventaService.registrarVenta(request);
        return ResponseEntity.ok(respuesta);
    }
}