package com.example.backend.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // 1. Alerta de stock: Productos cuyo stock es menor o igual al stock mínimo
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConBajoStock();

    // 2. Búsqueda por nombre
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // 3. Búsqueda general optimizada 
    @Query("SELECT p FROM Producto p WHERE " +
        "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Producto> buscarPorNombre(@Param("termino") String termino);
}