package com.example.backend.repository;

import com.example.backend.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    @Override
    @EntityGraph(attributePaths = {"detalles.producto"})
    Page<Venta> findAll(Pageable pageable);
}