package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Categoria;
import java.util.Optional;

public interface CategoriaRepository  extends JpaRepository<Categoria, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<Categoria> findByNombre(String nombre);
}