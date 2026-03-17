package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Marca;

public interface MarcaRepository  extends JpaRepository<Marca, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}