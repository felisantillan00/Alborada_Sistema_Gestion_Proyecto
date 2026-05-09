package com.example.backend.model;
import com.example.backend.enums.FormaPago;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "venta")
@Getter @Setter @ToString(exclude = "detalles") @Builder @NoArgsConstructor @AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago")
    private FormaPago formaPago; 

    private String observacion;

    @Column(name = "nombre_cliente")
    private String nombreCliente;

    @Column(name = "fecha_venta")
    private LocalDateTime fechaVenta;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detalles;
}