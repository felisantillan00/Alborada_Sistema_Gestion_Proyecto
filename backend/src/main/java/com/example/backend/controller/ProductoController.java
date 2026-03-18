package com.example.backend.controller;
import com.example.backend.dto.response.ProductoResponseDTO;
import com.example.backend.dto.request.ProductoRequestDTO;
import com.example.backend.service.ProductoService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@RestController
@RequestMapping("/producto")
@RequiredArgsConstructor
@Slf4j
public class ProductoController {
    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> listAll() {
        return ResponseEntity.ok(productoService.listAll());
    }

    @GetMapping("/find")
    public ResponseEntity<List<ProductoResponseDTO>> findByIdOrCodeOrName(@RequestParam String q) {
        return ResponseEntity.ok(productoService.findProducts(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDTO> create(@RequestBody ProductoRequestDTO request) {
        log.info("Recibida solicitud de creación de producto: {}", request.nombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> update(@PathVariable Long id, @RequestBody ProductoRequestDTO request) {
        return ResponseEntity.ok(productoService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}