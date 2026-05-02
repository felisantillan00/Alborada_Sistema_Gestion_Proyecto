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
@RequestMapping("/presupuesto")
@RequiredArgsConstructor
@Slf4j
public class PresupuestoController {
    private final OrdenServicioService service;

    // --- 1. POST: CREAR PRESUPUESTO ---
    @PostMapping
    public ResponseEntity<OrdenServicioResponseDTO> create(@Valid @RequestBody OrdenServicioRequestDTO request) {
        // Forzamos el flag a 0 para que nazca como presupuesto (isReparacion = false)
        // y en estado Pendiente_Aprobacion según tu Service.
        OrdenServicioResponseDTO response = service.create(request, 0);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. GET: OBTENER TODOS LOS PRESUPUESTOS ---
    @GetMapping
    public ResponseEntity<Page<OrdenServicioResponseDTO>> getAll(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        
        // Pasamos el pageable al servicio
        Page<OrdenServicioResponseDTO> presupuestos = service.obtenerTodosPorTipo(false, pageable);
        return ResponseEntity.ok(presupuestos);
    }

    // --- 3. GET: OBTENER UN PRESUPUESTO POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicioResponseDTO> getById(@PathVariable Long id) {
        // Validamos que el ID corresponda a un presupuesto (false)
        OrdenServicioResponseDTO response = service.obtenerPorIdYTipo(id, false);
        return ResponseEntity.ok(response);
    }

    // --- 4. PUT: ACTUALIZAR DATOS DEL PRESUPUESTO ---
    @PutMapping("/{id}")
    public ResponseEntity<OrdenServicioResponseDTO> update(
            @PathVariable Long id, 
            @Valid @RequestBody OrdenServicioRequestDTO request) {
        // Actualizamos bajo el contexto de presupuesto (false)
        OrdenServicioResponseDTO response = service.update(id, request, false);
        return ResponseEntity.ok(response);
    }

    // --- 5. PUT: APROBAR PRESUPUESTO (Avanzar Estado) ---
    /**
     * Este es el punto clave: Al llamar a este endpoint, la orden pasa de 
     * Pendiente a Aprobado_Presupuesto y el Service cambia isReparacion a true.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<OrdenServicioResponseDTO> approve(@PathVariable Long id) {
        OrdenServicioResponseDTO response = service.updateState(id);
        return ResponseEntity.ok(response);
    }

    // --- 6. DELETE: ELIMINAR PRESUPUESTO ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Aseguramos que solo se borre si es un presupuesto
        service.delete(id, false);
        return ResponseEntity.noContent().build();
    }
}