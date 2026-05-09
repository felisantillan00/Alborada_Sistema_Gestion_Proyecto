package com.example.backend.repository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.*;
import com.example.backend.model.OrdenServicio;
import org.springframework.data.domain.*;
import java.math.BigDecimal;
import java.util.Optional; 
import java.util.List;

public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Long> {
    Optional<OrdenServicio> findById(Long id);
    Page<OrdenServicio> findAllByIsReparacion(boolean isReparacion, Pageable pageable);

    //Calcula cuanta plata ingresa por reparaciones "ENTREGADAS". Para "Ingresos Mensuales"
     @Query("SELECT SUM(o.valorTotal) FROM OrdenServicio o WHERE MONTH(o.fechaCreacion) = :mes AND YEAR(o.fechaCreacion) = :anio AND o.estado = 'Finalizado'")
    BigDecimal sumReparacionesEntregadasPorMes(@Param("mes") int mes, @Param("anio") int anio);

    //Suma todo (Para pie y para grafico de comparacion)
    @Query("SELECT SUM(o.valorTotal) FROM OrdenServicio o WHERE o.estado = 'Finalizado'")
    BigDecimal sumTotalOrdenesEntregadas();

    //Trae el historial de los ultimos 6 meses, contando solo las reparaciones "ENTREGADAS" (Devuelve mes y cantidad de reparaciones)
    @Query("SELECT MONTH(o.fechaCreacion), COUNT(o) FROM OrdenServicio o WHERE o.fechaCreacion >= :fechaDesde AND o.estado = 'Finalizado' GROUP BY MONTH(o.fechaCreacion) ORDER BY MONTH(o.fechaCreacion)")
    List<Object[]> countReparacionesAgrupadasPorMes(@Param("fechaDesde") java.time.LocalDateTime fechaDesde);
}
    
  
   
    