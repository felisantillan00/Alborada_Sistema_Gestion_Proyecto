package com.example.backend.service;
import com.example.backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import com.example.backend.dto.CategoriaDTO;
import com.example.backend.model.Categoria;
import org.springframework.data.domain.*;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    // 1. Metodo Crear
    public CategoriaDTO create(CategoriaDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre de la Categoria es obligatorio");
        }
        String nombreLimpio = dto.getNombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new RuntimeException("Ya existe una Categoria con el nombre: " + nombreLimpio);
        }
        String nombreBonito = capitalizarTexto(nombreLimpio);
        Categoria Categoria = new Categoria();
        Categoria.setNombre(nombreBonito);
        categoriaRepository.save(Categoria);
        return mapToDTO(Categoria);
    }

    // 2. Metodo Listar
    public List<CategoriaDTO> listAll() {
        List<Categoria> lista = categoriaRepository.findAll();
        return lista.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    // 3. Metodo Buscar
    public CategoriaDTO findById(Long id) {
        Categoria Categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada con ID: " + id));
        return mapToDTO(Categoria);
    }

    // 4. Metodo Editar
    public CategoriaDTO update(Long id, CategoriaDTO dto) {
        // 1. Buscar la Categoria
        Categoria CategoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
        // 2. Validar que venga nombre
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        // 3. Limpiar espacios (sin pasar a mayúsculas todavía)
        String nombreLimpio = dto.getNombre().trim();
        // 4. Validacion:
        if (!CategoriaExistente.getNombre().equalsIgnoreCase(nombreLimpio) && 
            categoriaRepository.existsByNombreIgnoreCase(nombreLimpio)) {
            throw new RuntimeException("Ya existe otra Categoria con ese nombre");
        }
        // 5. Embellecer
        String nombreBonito = capitalizarTexto(nombreLimpio);
        // 6. Guardar cambios
        CategoriaExistente.setNombre(nombreBonito);
        return mapToDTO(categoriaRepository.save(CategoriaExistente));
    }

    // 5. Metodo Eliminar
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, ID no encontrado");
        }
        categoriaRepository.deleteById(id);
    }

    public Page<CategoriaDTO> findAll(Pageable pageable) {
        // El repository ya sabe recibir un pageable y devolver un Page<Entity>
        return categoriaRepository.findAll(pageable)
            .map(this::mapToDTO); // Convertimos cada Categoria del Page a DTO
    }

    // --- MÉTODO PRIVADO DE AYUDA (HELPER) ---
    private CategoriaDTO mapToDTO(Categoria Categoria) {
        return CategoriaDTO.builder()
                .id(Categoria.getId())
                .nombre(Categoria.getNombre())
                .descripcion(Categoria.getDescripcion())
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