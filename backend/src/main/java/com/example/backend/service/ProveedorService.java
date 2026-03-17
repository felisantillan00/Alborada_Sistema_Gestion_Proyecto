package com.example.backend.service;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ProveedorDTO;
import com.example.backend.model.Proveedor;
import com.example.backend.repository.ProveedorRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProveedorService {
    private final ProveedorRepository proveedorRepository;
    // private final ProductoRepository productoRepository;

    public ProveedorDTO create(ProveedorDTO dto) {
        // 1. Validar nombre obligatorio
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del proveedor es obligatorio");
        }
        // 2. Validar CUIT único (si viene uno)
        if (dto.getCuit() != null && !dto.getCuit().isBlank()) {
            if (proveedorRepository.findByCuit(dto.getCuit()).isPresent()) {
                throw new RuntimeException("Ya existe un proveedor con el CUIT: " + dto.getCuit());
            }
        }
        // 3. Construir y Embellecer
        Proveedor proveedor = Proveedor.builder()
            .nombre(capitalizarTexto(dto.getNombre()))
            .cuit(dto.getCuit())
            .telefono(dto.getTelefono())
            .email(dto.getEmail())
            .direccion(capitalizarTexto(dto.getDireccion())) 
            .observacion(dto.getObservacion())
            .build();

        return mapToDTO(proveedorRepository.save(proveedor));
    }

    public List<ProveedorDTO> listAll() {
        log.info("Listando todos los proveedores...");
        return proveedorRepository.findAll().stream()
        .map(this::mapToDTO)
        .collect(Collectors.toList());
    }

    public ProveedorDTO findById(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));
        return mapToDTO(proveedor);
    }

    public ProveedorDTO update(Long id, ProveedorDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        // 1. Validar CUIT único al modificar
        if (dto.getCuit() != null && !dto.getCuit().isBlank() && 
            !dto.getCuit().equals(proveedor.getCuit())) {
            
            if (proveedorRepository.findByCuit(dto.getCuit()).isPresent()) {
                throw new RuntimeException("El CUIT ya pertenece a otro proveedor");
            }
        }

        // 2. Actualizar campos con "Embellecimiento"
        if (dto.getNombre() != null && !dto.getNombre().isBlank()) {
            proveedor.setNombre(capitalizarTexto(dto.getNombre()));
        }
        
        // Aplicamos lo mismo a Dirección y Rubro para mantener la estética
        proveedor.setDireccion(capitalizarTexto(dto.getDireccion()));
        proveedor.setCuit(dto.getCuit());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setEmail(dto.getEmail());
        proveedor.setObservacion(dto.getObservacion());

        Proveedor actualizado = proveedorRepository.save(proveedor);
        return mapToDTO(actualizado);
    }

    // Metodo DELETE
    public void delete(Long id) {
        // A. Validar que el proveedor exista
        if (!proveedorRepository.existsById(id)) {
            throw new RuntimeException("Proveedor no encontrado");
        }
        // // B. VALIDACIÓN DE INTEGRIDAD (Lo que pidió el reporte)
        // if (productoRepository.existsByProveedorId(id)) {
        //     throw new RuntimeException("No se puede eliminar el proveedor porque tiene productos asociados. Elimine o edite esos productos primero.");
        // }

        // C. Si pasó las validaciones, borramos tranquilo
        proveedorRepository.deleteById(id);
    }


    // --- MAPPER ---
    private ProveedorDTO mapToDTO(Proveedor p) {
        return ProveedorDTO.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .cuit(p.getCuit())
                .telefono(p.getTelefono())
                .email(p.getEmail())
                .direccion(p.getDireccion())
                .observacion(p.getObservacion())
                .build();
    }

    // Método auxiliar para capitalizar cada palabra
    private String capitalizarTexto(String texto) {
        if (texto == null || texto.isEmpty()) {
            return texto;
        }
        
        String[] palabras = texto.trim().toLowerCase().split("\\s+");
        StringBuilder resultado = new StringBuilder();

        for (String palabra : palabras) {
            if (!palabra.isEmpty()) {
                resultado.append(Character.toUpperCase(palabra.charAt(0)))
                .append(palabra.substring(1))
                .append(" ");
            }
        }
        return resultado.toString().trim();
    }

}
