package com.example.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.OrdenServicio;
import org.springframework.data.domain.*;
import java.util.List;
import java.math.BigDecimal;
import java.util.Optional; 

public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Long> {
    Optional<OrdenServicio> findById(Long id);
    Page<OrdenServicio> findAllByIsReparacion(boolean isReparacion, Pageable pageable);

    //Calcula cuanta plata ingresa por reparaciones "ENTREGADAS". Para "Ingresos Mensuales"
     @Query("SELECT SUM(o.valorTotal) FROM OrdenServicio o WHERE MONTH(o.fechaCreacion) = :mes AND YEAR(o.fechaCreacion) = :anio AND o.estadoReparacion = 'Finalizado'")
    BigDecimal sumReparacionesEntregadasPorMes(@Param("mes") int mes, @Param("anio") int anio);

    //Suma todo (Para pie y para grafico de comparacion)
    @Query("SELECT SUM(o.valorTotal) FROM OrdenServicio o WHERE o.estadoReparacion = 'Finalizado'")
    BigDecimal sumTotalOrdenesEntregadas();

    //Trae el historial de los ultimos 6 meses, contando solo las reparaciones "ENTREGADAS" (Devuelve mes y cantidad de reparaciones)
    @Query("SELECT MONTH(o.fechaCreacion), COUNT(o) FROM OrdenServicio o WHERE o.fechaCreacion >= :fechaDesde AND o.estadoReparacion = 'Finalizado' GROUP BY MONTH(o.fechaCreacion) ORDER BY MONTH(o.fechaCreacion)")
    List<Object[]> countReparacionesAgrupadasPorMes(@Param("fechaDesde") java.time.LocalDate fechaDesde);
}
    
  
   
    