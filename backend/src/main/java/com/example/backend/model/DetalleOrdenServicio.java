package com.example.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "detalle_orden_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación de vuelta hacia la Orden de Servicio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_servicio_id", nullable = false)
    private OrdenServicio ordenServicio;

    // Relación hacia Producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(name = "valor_unitario", nullable = false)
    private BigDecimal valorUnitario;

    @Column(nullable = false)
    private Integer cantidad;
}