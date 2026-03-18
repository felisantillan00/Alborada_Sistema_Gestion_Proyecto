package com.example.backend.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "producto")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    @Column(name = "precio_venta",precision = 10, scale = 2) // scale 2 permite 10.50
    private BigDecimal precioVenta;
    @Column(name = "precio_costo", precision = 10, scale = 2) // scale 2 permite 10.50
    private BigDecimal precioCosto;

    private BigDecimal stock;

    @Column(name = "stock_minimo")
    private BigDecimal stockMinimo;

    @Column(name = "margen_ganancia")
    private BigDecimal margenGanancia; // Sirve para calcular el precioVenta = precioCosto % margenGanancia

    // Muchos Productos -> Una Categoria
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
    
    // Muchos Productos -> Una Marca
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_marca", nullable = false)
    private Marca marca;
    
    // Muchos Productos -> Un Proveedor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proveedor", nullable = true)
    private Proveedor proveedor;
}