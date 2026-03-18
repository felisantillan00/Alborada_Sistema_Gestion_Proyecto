package com.example.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarcaDTO {
    private Long id;
    @NotBlank(message = "El nombre de la marca es obligatorio")
    private String nombre;
    private String descripcion;
}