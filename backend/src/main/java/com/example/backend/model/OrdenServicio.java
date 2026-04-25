package com.example.backend.model;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.enums.EstadoOrden;

import lombok.Data;

@Entity
@Table(name = "orden_servicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_cliente", nullable = false) 
    private String nombreCliente;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoOrden estado;

    @Column(name = "valor_total")
    private BigDecimal valorTotal;

    @Column(columnDefinition = "TEXT")
    private String observacion;

    @Column(name = "valor_mano_obra")
    private BigDecimal valorManoObra;

    @Column(name = "fecha_confirmada")
    private LocalDateTime fechaConfirmada;

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
            if (this.estado == null) {
                this.estado = EstadoOrden.Aprobado_Presupuesto; 
            }
        } 
        else {  //caso presupuesto
            if (this.estado == null) {
                this.estado = EstadoOrden.Pendiente_Aprobacion; 
            }
            
        }
    }
    
    // Método helper para mantener la sincronización bidireccional
    public void addDetalle(DetalleOrdenServicio detalle) {
        detalles.add(detalle);
        detalle.setOrdenServicio(this);
    }
}