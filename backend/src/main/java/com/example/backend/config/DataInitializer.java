package com.example.backend.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import com.example.backend.model.*;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    private final ProveedorRepository proveedorRepository;
    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Verificamos si ya hay datos. Si la tabla tiene registros, no hacemos nada.
        // Cargamos Proveedores
        if (proveedorRepository.count() == 0) {
            log.info("Cargando proveedores iniciales...");
            proveedorRepository.save(Proveedor.builder()
                .nombre("Distribuidora Pampeana")
                .cuit("20-12345678-9")
                .email("contacto@pampeana.com")
                .direccion("Calle 13, General Pico")
                .build());
        }

        // 2. Cargamos Marcas 
        if (marcaRepository.count() == 0) {
            log.info("Cargando marcas iniciales...");
            marcaRepository.save(Marca.builder()
                .nombre("Shimano")
                .descripcion("Componentes de transmisión")
                .build());
        }

        // 3. Cargamos Categorias
        if (categoriaRepository.count() == 0) {
            log.info("Cargando categorias iniciales...");
            categoriaRepository.save(Categoria.builder()
                .nombre("Transmisión")
                .descripcion("Componentes relacionados con la transmisión de la bicicleta") 
                .build());
        }
    }
}