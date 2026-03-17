package com.example.backend.controller;
import org.springframework.web.bind.annotation.*;
import com.example.backend.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import com.example.backend.dto.CategoriaDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/categoria")
@RequiredArgsConstructor
@Slf4j
public class CategoriaController {
    private final CategoriaService categoriaService;

    // Metodo Listar
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listAll() {
        return ResponseEntity.ok(categoriaService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findById(id));
    }

    // Metodo Crear
    @PostMapping
    public ResponseEntity<CategoriaDTO> create(@RequestBody CategoriaDTO dto) {
        log.info("Recibida solicitud de creación de categoria:", dto.getNombre());
        CategoriaDTO creada = categoriaService.create(dto);
        return ResponseEntity.status(201).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> update(@PathVariable Long id, @RequestBody CategoriaDTO dto) {
        return ResponseEntity.ok(categoriaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}