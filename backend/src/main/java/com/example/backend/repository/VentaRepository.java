package com.example.backend.repository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.*;
import com.example.backend.model.Venta;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    //Total del mes actual
    @Query("SELECT SUM(v.total) FROM Venta v WHERE MONTH(v.fechaVenta) = :mes AND YEAR(v.fechaVenta) = :anio")
    BigDecimal sumVentasPorMes(@Param("mes") int mes, @Param("anio") int anio);

    //Total histórico para la torta
    @Query("SELECT SUM(v.total) FROM Venta v")
    BigDecimal sumTotalVentas();

    //Arreglo de los últimos 6 meses (Devuelve Mes y Total)
    @Query("SELECT MONTH(v.fechaVenta), SUM(v.total) FROM Venta v WHERE v.fechaVenta >= :fechaDesde GROUP BY MONTH(v.fechaVenta) ORDER BY MONTH(v.fechaVenta)")
    List<Object[]> obtenerVentasAgrupadasPorMes(@Param("fechaDesde") java.time.LocalDateTime fechaDesde);
}