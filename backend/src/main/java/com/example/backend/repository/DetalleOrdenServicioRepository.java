package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.DetalleOrdenServicio;
import com.example.backend.model.OrdenServicio;

import java.util.Optional; 

public interface DetalleOrdenServicioRepository extends JpaRepository<DetalleOrdenServicio, Long> {
    Optional<DetalleOrdenServicio> findById(Long id);
}
