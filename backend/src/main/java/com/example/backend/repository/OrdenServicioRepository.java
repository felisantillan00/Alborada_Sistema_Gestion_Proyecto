package com.example.backend.repository;

import com.example.backend.model.OrdenServicio;
import com.example.backend.dto.ReparacionPorMesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Long> {

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM OrdenServicio o WHERE o.estado = 'ENTREGADO' AND o.fechaEntrega >= :fechaInicio")
    BigDecimal sumTotalOrdenesServicioEntregadasUltimosSeisMeses(@Param("fechaInicio") LocalDateTime fechaInicio);

    @Query("SELECT new com.example.backend.dto.ReparacionPorMesDTO(MONTH(o.fechaIngreso), COUNT(o)) FROM OrdenServicio o WHERE o.fechaIngreso >= :fechaInicio GROUP BY MONTH(o.fechaIngreso)")
    List<ReparacionPorMesDTO> countReparacionesPorMes(@Param("fechaInicio") LocalDateTime fechaInicio);
}
