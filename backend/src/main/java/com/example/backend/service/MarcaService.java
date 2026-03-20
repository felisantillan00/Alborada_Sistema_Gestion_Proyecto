package com.example.backend.service;
import com.example.backend.repository.MarcaRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import com.example.backend.dto.MarcaDTO;
import com.example.backend.model.Marca;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarcaService {
   private final MarcaRepository marcaRepository;

    // 1. Metodo Crear
    public MarcaDTO create(MarcaDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre de la marca es obligatorio");
        }
        String nombreLimpio = dto.getNombre().trim();
        if (marcaRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new RuntimeException("Ya existe una marca con el nombre: " + nombreLimpio);
        }
        String nombreBonito = capitalizarTexto(nombreLimpio);
        Marca marca = new Marca();
        marca.setNombre(nombreBonito);
        marcaRepository.save(marca);
        return mapToDTO(marca);
    }

    // 2. Metodo Listar
    public List<MarcaDTO> listAll() {
        List<Marca> lista = marcaRepository.findAll();
        return lista.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    // 3. Metodo Buscar
    public MarcaDTO findById(Long id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada con ID: " + id));
        return mapToDTO(marca);
    }

    // 4. Metodo Editar
    public MarcaDTO update(Long id, MarcaDTO dto) {
        // 1. Buscar la marca
        Marca marcaExistente = marcaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
        // 2. Validar que venga nombre
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        // 3. Limpiar espacios (sin pasar a mayúsculas todavía)
        String nombreLimpio = dto.getNombre().trim();
        // 4. Validacion:
        if (!marcaExistente.getNombre().equalsIgnoreCase(nombreLimpio) && 
            marcaRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new RuntimeException("Ya existe otra marca con ese nombre");
        }
        // 5. Embellecer
        String nombreBonito = capitalizarTexto(nombreLimpio);
        // 6. Guardar cambios
        marcaExistente.setNombre(nombreBonito);
        return mapToDTO(marcaRepository.save(marcaExistente));
    }

    // 5. Metodo Eliminar
    public void delete(Long id) {
        if (!marcaRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, ID no encontrado");
        }
        marcaRepository.deleteById(id);
    }

    public Page<MarcaDTO> findAll(Pageable pageable) {
        // El repository ya sabe recibir un pageable y devolver un Page<Entity>
        return marcaRepository.findAll(pageable)
            .map(this::mapToDTO); // Convertimos cada Categoria del Page a DTO
    }

    // --- MÉTODO PRIVADO DE AYUDA (HELPER) ---
    private MarcaDTO mapToDTO(Marca marca) {
        return MarcaDTO.builder()
                .id(marca.getId())
                .nombre(marca.getNombre())
                .descripcion(marca.getDescripcion())
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