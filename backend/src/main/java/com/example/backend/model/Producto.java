package com.example.backend.model;
import org.hibernate.annotations.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "producto")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE producto SET activo = false WHERE id = ?") 
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    
    private String descripcion;
    
    @Column(name = "precio_venta", precision = 10, scale = 2)
    private BigDecimal precioVenta;
    
    @Column(name = "precio_costo", precision = 10, scale = 2)
    private BigDecimal precioCosto;

    private BigDecimal stock;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true; 

    @Column(name = "stock_minimo")
    private BigDecimal stockMinimo;

    @Column(name = "margen_ganancia")
    private BigDecimal margenGanancia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_marca", nullable = false)
    private Marca marca;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor", nullable = true)
    private Proveedor proveedor;
}