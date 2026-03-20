package com.example.backend.controller;
import org.springframework.web.bind.annotation.*;
import com.example.backend.service.MarcaService;
import org.springframework.http.ResponseEntity;
import com.example.backend.dto.MarcaDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/marca")
@RequiredArgsConstructor
@Slf4j
public class MarcaController {
    private final MarcaService marcaService;

    // Metodo Listar
    @GetMapping
    public ResponseEntity<List<MarcaDTO>> listAll() {
        return ResponseEntity.ok(marcaService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarcaDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(marcaService.findById(id));
    }

    // Metodo Crear
    @PostMapping
    public ResponseEntity<MarcaDTO> create(@RequestBody MarcaDTO dto) {
        log.info("Recibida solicitud de creación de marca:", dto.getNombre());
        MarcaDTO creada = marcaService.create(dto);
        return ResponseEntity.status(201).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarcaDTO> update(@PathVariable Long id, @RequestBody MarcaDTO dto) {
        return ResponseEntity.ok(marcaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        marcaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}