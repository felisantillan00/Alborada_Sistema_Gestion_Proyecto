package com.example.backend.repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import com.example.backend.model.Producto;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // 1. Alerta de stock: Productos cuyo stock es menor o igual al stock mínimo
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConBajoStock();

    // 2. Búsqueda general optimizada 
    @Query("SELECT p FROM Producto p WHERE " +
        "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Producto> buscarPorNombre(@Param("termino") String termino);
}