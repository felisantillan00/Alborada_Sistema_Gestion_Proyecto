package com.example.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaDTO {
    private Long id;
    @NotBlank(message = "El nombre de la categoria es obligatoria")
    private String nombre;
    private String descripcion;
}