package com.example.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProveedorDTO {
    private Long id;
    @NotBlank(message = "El nombre del proveedor es obligatorio")
    private String nombre;
    private String cuit;
    private String telefono;
    @Email(message = "Formato de email inválido")
    private String email;
    private String direccion;
    private String observacion;
}