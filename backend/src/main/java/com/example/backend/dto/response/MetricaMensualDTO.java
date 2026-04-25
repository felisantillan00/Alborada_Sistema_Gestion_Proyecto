package com.example.backend.dto.response;
import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetricaMensualDTO {
    private String mes;
    private BigDecimal total;
}