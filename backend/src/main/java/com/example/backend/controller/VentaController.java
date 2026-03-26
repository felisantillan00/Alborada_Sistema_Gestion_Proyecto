package com.example.backend.controller;

import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@Slf4j
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    public ResponseEntity<Page<VentaResponseDTO>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ventaService.findAll(pageable));
    }

    @PostMapping
    public ResponseEntity<VentaResponseDTO> create(@RequestBody VentaRequestDTO request) {
        log.info("Registrando nueva venta para el cliente: {}", request.nombreCliente());
        return ResponseEntity.ok(ventaService.create(request));
    }
}