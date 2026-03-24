package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

}
