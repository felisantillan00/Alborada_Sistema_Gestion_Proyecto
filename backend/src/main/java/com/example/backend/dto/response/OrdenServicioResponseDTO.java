package com.example.backend.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrdenServicioResponseDTO {
    private Long id;
    private String nombreCliente;
    private String estado;
    private BigDecimal valorTotal;
    private BigDecimal valorManoDeObra;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaConfirmada;
    private String observacion;
    private DetalleOrdenServicioResponseDTO[] detalles;
}
