package com.example.backend.repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import com.example.backend.model.Producto;
import java.util.Optional; 
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
 // 1. Listado paginado de solo productos ACTIVOS
    Page<Producto> findAllByActivoTrue(Pageable pageable);

// 2. Alerta de stock: Productos ACTIVOS cuyo stock es menor o igual al stock mínimo
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock <= p.stockMinimo")
    List<Producto> findProductosConBajoStock();

// 3. Búsqueda general optimizada sobre productos ACTIVOS
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Producto> searchActiveProducts(@Param("termino") String termino);
}