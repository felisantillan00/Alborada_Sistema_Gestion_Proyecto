package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.OrdenServicio;
import org.springframework.data.domain.*;
import java.util.Optional; 

public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Long> {
    Optional<OrdenServicio> findById(Long id);
    Page<OrdenServicio> findAllByIsReparacion(boolean isReparacion, Pageable pageable);
}
