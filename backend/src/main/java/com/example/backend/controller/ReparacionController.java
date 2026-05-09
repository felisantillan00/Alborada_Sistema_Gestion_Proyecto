package com.example.backend.controller;
import com.example.backend.dto.response.OrdenServicioResponseDTO;
import com.example.backend.dto.request.OrdenServicioRequestDTO;
import com.example.backend.service.OrdenServicioService;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/reparacion")
@RequiredArgsConstructor
@Slf4j
public class ReparacionController {

    private final OrdenServicioService service;

    // --- 1. POST: CREAR REPARACIÓN ---
    @PostMapping
    public ResponseEntity<OrdenServicioResponseDTO> create(@Valid @RequestBody OrdenServicioRequestDTO request) {
        // Se fuerza el flag a 1 para que se cree como reparación
        OrdenServicioResponseDTO response = service.create(request, 1);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. GET: OBTENER TODAS LAS REPARACIONES ---
    @GetMapping
    public ResponseEntity<Page<OrdenServicioResponseDTO>> getAll(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        
        // Pasamos el pageable al servicio
        Page<OrdenServicioResponseDTO> reparaciones = service.obtenerTodosPorTipo(true, pageable);
        return ResponseEntity.ok(reparaciones);
    }

    // --- 3. GET: OBTENER UNA REPARACIÓN POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicioResponseDTO> getById(@PathVariable Long id) {
        // Pedimos la orden asegurándonos de que sea tipo reparación
        OrdenServicioResponseDTO response = service.obtenerPorIdYTipo(id, true);
        return ResponseEntity.ok(response);
    }

    // --- 4. PUT: ACTUALIZAR DATOS DE LA REPARACIÓN ---
    @PutMapping("/{id}")
    public ResponseEntity<OrdenServicioResponseDTO> update(
            @PathVariable Long id, 
            @Valid @RequestBody OrdenServicioRequestDTO request) {
        // Actualizamos forzando el flag a 1 para que no la conviertan en presupuesto por error
        OrdenServicioResponseDTO response = service.update(id, request, true);
        return ResponseEntity.ok(response);
    }

    // --- 5. PUT: CAMBIAR SOLO EL ESTADO ---
    // Endpoint específico para la regla de negocio de cambiar estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenServicioResponseDTO> changeState(
            @PathVariable Long id) {
        OrdenServicioResponseDTO response = service.updateState(id);
        return ResponseEntity.ok(response);
    }

    // --- 6. DELETE: ELIMINAR REPARACIÓN ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, true); // Le pasamos true para asegurarnos de no borrar un presupuesto desde esta ruta
        return ResponseEntity.noContent().build(); // Retorna 204 No Content, ideal para deletes
    }
}