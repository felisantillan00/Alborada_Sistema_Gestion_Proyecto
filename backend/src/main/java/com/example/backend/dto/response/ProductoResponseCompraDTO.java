package com.example.backend.dto.response;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ProductoResponseCompraDTO {
    private Long id;
    private String nombre;
}
