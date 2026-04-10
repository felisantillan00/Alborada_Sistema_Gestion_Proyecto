package com.example.backend.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orden_servicio")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_reparacion", nullable = false)
    private EstadoOrden estadoReparacion;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    @Column(columnDefinition = "TEXT")
    private String observacion;

    @Column(name = "valor_mano_obra")
    private BigDecimal valorManoObra;

    @Column(name = "fecha_confirmacion_reparacion")
    private LocalDateTime fechaConfirmacion_reparacion;

    // Flag: 0 = Presupuesto, 1 = Reparación
    @Column(name = "is_reparacion", nullable = false)
    private Boolean isReparacion = false; // Por defecto es presupuesto, se cambia a reparación al confirmar el presupuesto

    // Relación OneToMany hacia el detalle
    // CascadeType.ALL para que las operaciones en OrdenServicio se propaguen a DetalleOrdenServicio
    @OneToMany(mappedBy = "ordenServicio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrdenServicio> detalles = new ArrayList<>();

    // Método de ciclo de vida JPA para setear la fecha de creación automáticamente
    @PrePersist
    protected void onCreate() {
        // Esto aplica para ambos (Reparación y Presupuesto)
        this.fechaCreacion = LocalDateTime.now();

        if (Boolean.TRUE.equals(this.isReparacion)) { //caso reparación
            if (this.estadoReparacion == null) {
                this.estadoReparacion = EstadoOrden.Aprobado_Presupuesto; 
            }
        } 
        else {  //caso presupuesto
            if (this.estadoReparacion == null) {
                this.estadoReparacion = EstadoOrden.Pendiente_Aprobacion; 
            }
            
        }
    }
    
    // Método helper para mantener la sincronización bidireccional
    public void addDetalle(DetalleOrdenServicio detalle) {
        detalles.add(detalle);
        detalle.setOrdenServicio(this);
    }
}
