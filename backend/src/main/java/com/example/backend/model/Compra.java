package com.example.backend.model;
import com.example.backend.enums.FormaPago;
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

    private FormaPago formaPago;

    @Column(name = "total_compra", scale = 2, precision = 10)
    private BigDecimal totalCompra;

    @Column(name = "cantidad_total", nullable = false)
    private Integer cantidadTotal;

    public void setProveedorId(Long id) {
        if (id != null) {
            proveedor.setId(id);
        }
    }

    public Long getProveedorId() {
        return proveedor != null ? proveedor.getId() : null;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }
}
