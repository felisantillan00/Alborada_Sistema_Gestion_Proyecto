package com.example.backend.controller;
import com.example.backend.service.ProveedorService;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.ProveedorDTO;
import org.springframework.data.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/proveedor")
@RequiredArgsConstructor
@Slf4j
public class ProveedorController {
    private final ProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<Page<ProveedorDTO>> getAll(Pageable pageable) {
        return ResponseEntity.ok(proveedorService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(proveedorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProveedorDTO> create(@Valid @RequestBody ProveedorDTO dto) {
        log.info("Recibida solicitud de creación de proveedor para: {}", dto.getNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(proveedorService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> update(@PathVariable Long id, @Valid @RequestBody ProveedorDTO dto) {
        log.info("Actualizando proveedor con ID: {}", id);
        return ResponseEntity.ok(proveedorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.warn("Eliminando proveedor con ID: {}", id); // Se usa WARN porque es una acción destructiva
        proveedorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}