package com.example.backend.model;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "compra")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleCompra> detalles;
    
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    @Column(name = "fecha_compra", nullable = false)
    private LocalDateTime fechaCompra;

    @Column(name = "total_compra", scale = 2, precision = 10)
    private BigDecimal totalCompra;

    @Column(name = "cantidad_total", nullable = false)
    private Integer cantidadTotal;

    public void setProveedorNombre(String nombre) {
        if (nombre != null) {
            proveedor.setNombre(nombre);
        }
    }

    public String getProveedorNombre() {
        return proveedor != null ? proveedor.getNombre() : null;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }
}
