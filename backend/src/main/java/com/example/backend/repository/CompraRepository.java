package com.example.backend.repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Compra;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    //Suma total de gastos (compras) de un mes y anio específico. Para "Gastos Mensuales"
    @Query("SELECT SUM(c.totalCompra) FROM Compra c WHERE MONTH(c.fechaCompra) = :mes AND YEAR(c.fechaCompra) = :anio")
    BigDecimal sumComprasPorMes(@Param("mes") int mes, @Param("anio") int anio);
   
    //Historial de los ultimos 6 meses (Devuelve mes y total gastado)
    @Query("SELECT MONTH(c.fechaCompra), SUM(c.totalCompra) FROM Compra c WHERE c.fechaCompra >= :fechaDesde GROUP BY MONTH(c.fechaCompra) ORDER BY MONTH(c.fechaCompra)")
    List<Object[]> obtenerComprasAgrupadasPorMes(@Param("fechaDesde") java.time.LocalDate fechaDesde);   
}