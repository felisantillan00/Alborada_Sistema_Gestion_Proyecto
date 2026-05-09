package com.example.backend.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proveedor")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true)
    private String cuit;
    private String telefono;
    private String email;
    private String direccion;
    private String observacion;
}