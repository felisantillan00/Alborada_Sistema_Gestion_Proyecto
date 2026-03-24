package com.example.backend.controller;

import com.example.backend.dto.request.CompraRequestDTO;
import com.example.backend.dto.response.CompraResponseDTO;
import com.example.backend.service.CompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/compra")
@RequiredArgsConstructor
@Slf4j
public class CompraController {

    private final CompraService compraService;

    // --- 1. LISTAR TODAS LAS COMPRAS (AHORA CON PAGINACIÓN) ---
    @GetMapping
    public ResponseEntity<Page<CompraResponseDTO>> getAll(Pageable pageable) {
        
        log.info("Recibiendo petición GET para listar compras (Página: {}, Tamaño: {})", 
                 pageable.getPageNumber(), pageable.getPageSize());
                 
        return ResponseEntity.ok(compraService.findAll(pageable));
    }

    // --- 2. BUSCAR COMPRA POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<CompraResponseDTO> getById(@PathVariable Long id) {
        log.info("Recibiendo petición GET para la compra con ID: {}", id);
        return ResponseEntity.ok(compraService.findById(id));
    }

    // --- 3. CREAR NUEVA COMPRA ---
    @PostMapping
    public ResponseEntity<CompraResponseDTO> create(@Valid @RequestBody CompraRequestDTO request) {
        log.info("Recibiendo petición POST para crear compra del proveedor: {}", request.proveedorNombre());
        CompraResponseDTO response = compraService.create(request);
        
        // Retornamos 201 CREATED
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 4. ACTUALIZAR COMPRA ---
    @PutMapping("/{id}")
    public ResponseEntity<CompraResponseDTO> update(@PathVariable Long id, @Valid @RequestBody CompraRequestDTO request) {
        log.info("Recibiendo petición PUT para actualizar compra con ID: {}", id);
        CompraResponseDTO response = compraService.update(id, request);
        
        // Retornamos 200 OK
        return ResponseEntity.ok(response);
    }
    
    // --- 5. ELIMINAR COMPRA ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Recibiendo petición DELETE para la compra con ID: {}", id);
        
        compraService.delete(id);
        return ResponseEntity.noContent().build(); 
    }
}
