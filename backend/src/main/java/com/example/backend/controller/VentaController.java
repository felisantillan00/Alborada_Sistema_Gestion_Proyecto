package com.example.backend.controller;

import com.example.backend.dto.request.VentaRequestDTO;
import com.example.backend.dto.response.VentaResponseDTO;
import com.example.backend.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200", "http://localhost:5173"}) 
public class VentaController {

    private final VentaService ventaService;

    //Metodo para obtener todas las ventas con paginación
    @GetMapping
    public ResponseEntity<Page<VentaResponseDTO>> obtenerVentas(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ventaService.listarVentas(pageable));
    }

    @PostMapping
    public ResponseEntity<VentaResponseDTO> registrarVenta(@RequestBody VentaRequestDTO request) {
        //Recibe el JSON del frontend y lo manda a Service
        log.info("Registrando nueva venta para el cliente: {}", request.nombreCliente());
        VentaResponseDTO respuesta = ventaService.registrarVenta(request);
        return ResponseEntity.ok(respuesta);
    }
}