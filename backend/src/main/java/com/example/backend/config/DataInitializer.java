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

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Verificamos si ya hay datos. Si la tabla tiene registros, no hacemos nada.
        if (proveedorRepository.count() > 0) {
            log.info("La base de datos ya tiene información. Omitiendo inicialización.");
            return;
        }
        log.info("Iniciando carga de datos de prueba para el equipo...");

        // 2. PROVEEDORES
        Proveedor prov1 = Proveedor.builder()
                .nombre("Distribuidora Pampeana")
                .cuit("20-12345678-9")
                .email("contacto@pampeana.com")
                .direccion("Calle 13, General Pico")
                .telefono("02954-123456")
                .observacion("Proveedor de insumos agrícolas")
                .build();
        proveedorRepository.save(prov1);

        log.info("Carga de datos finalizada con éxito.");
    }
}