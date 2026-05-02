package com.example.backend.controller;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.dto.request.VentaRequestDTO;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import com.example.backend.service.VentaService;
import org.springframework.data.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@Slf4j
public class VentaController {
    private final VentaService ventaService;

    // --- 1. POST: CREAR VENTA ---
    @PostMapping
    public ResponseEntity<VentaResponseDTO> create(@Valid @RequestBody VentaRequestDTO request) {
        VentaResponseDTO response = ventaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. GET: OBTENER TODAS LAS VENTAS PAGINADAS ---
    @GetMapping
    public ResponseEntity<Page<VentaResponseDTO>> getAll(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<VentaResponseDTO> ventas = ventaService.findAll(pageable);
        return ResponseEntity.ok(ventas);
    }

    // --- 3. PUT: ACTUALIZAR VENTA ---
    @PutMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> update(
            @PathVariable Long id, 
            @Valid @RequestBody VentaRequestDTO request) {
        VentaResponseDTO response = ventaService.update(id, request);
        return ResponseEntity.ok(response);
    }

    // --- 4. DELETE: ELIMINAR VENTA ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}