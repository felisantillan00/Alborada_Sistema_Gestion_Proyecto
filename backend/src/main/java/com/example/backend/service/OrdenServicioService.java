package com.example.backend.service;

import com.example.backend.dto.request.OrdenServicioRequestDTO;
import com.example.backend.dto.request.DetalleOrdenServicioRequestDTO;
import com.example.backend.dto.response.DetalleOrdenServicioResponseDTO;
import com.example.backend.dto.response.OrdenServicioResponseDTO;
import com.example.backend.exception.NegocioException;
import com.example.backend.model.DetalleOrdenServicio;
import com.example.backend.model.OrdenServicio;
import com.example.backend.model.Producto;
import com.example.backend.model.EstadoOrden;
import com.example.backend.repository.OrdenServicioRepository;
import com.example.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrdenServicioService {

    private final OrdenServicioRepository repository;
    private final ProductoRepository productoRepository;
    private final ProductoService productoService;

    // --> CREATE
    public OrdenServicioResponseDTO create(OrdenServicioRequestDTO request, Integer flagReparacion) {
        OrdenServicio orden = new OrdenServicio();
        orden.setObservacion(request.observacion());
        BigDecimal manoObra = request.valorManoDeObra() != null ? request.valorManoDeObra() : BigDecimal.ZERO;
        orden.setValorManoObra(manoObra);
        
        // Mapear Detalles y calcular Total
        BigDecimal totalDetalles = BigDecimal.ZERO;
        if (request.detalles() != null) {
            for (DetalleOrdenServicioRequestDTO detDto : request.detalles()) {
                
                DetalleOrdenServicio detalle = mapearDetalle(detDto);
                orden.addDetalle(detalle);
                // 3. Calculamos el subtotal usando el precio que sacamos de la BD
                BigDecimal subtotal = detalle.getValorUnitario().multiply(new BigDecimal(detDto.cantidad()));
                totalDetalles = totalDetalles.add(subtotal);
            }
        }
        orden.setValorTotal(totalDetalles.add(manoObra));

        // REGLA DE NEGOCIO: Configuración según Flag
        if (flagReparacion == 1) {
            orden.setIsReparacion(true);
            orden.setFechaConfirmacion_reparacion(LocalDateTime.now());
            orden.setEstadoReparacion(EstadoOrden.Aprobado_Presupuesto);
            
            // Al ser reparación directa, descontamos stock
            descuentoStock(orden);
            
        } else {
            orden.setIsReparacion(false);
            orden.setEstadoReparacion(EstadoOrden.Pendiente_Aprobacion);
        }

        OrdenServicio guardada = repository.save(orden);
        log.info("Orden {} creada como {}", guardada.getId(), orden.getIsReparacion() ? "REPARACIÓN" : "PRESUPUESTO");
        return mapToDTO(guardada);
    }

    // --> GET ALL
    public Page<OrdenServicioResponseDTO> obtenerTodosPorTipo(boolean isReparacion, Pageable pageable) {
        
        Page<OrdenServicio> paginaOrdenes = repository.findAllByIsReparacion(isReparacion, pageable);
        return paginaOrdenes.map(this::mapToDTO);
    }

    // --> GET por ID
    public OrdenServicioResponseDTO obtenerPorIdYTipo(Long id, boolean isReparacion) {
        OrdenServicio orden = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Orden no encontrada con ID: " + id));
        
        // Medida de seguridad: validamos que el tipo coincida con la ruta
        if (orden.getIsReparacion() != isReparacion) {
            throw new NegocioException("La orden solicitada no corresponde a este tipo de operación");
        }
        return mapToDTO(orden);
    }

    // --> DELETE
    public void delete(Long id, boolean isReparacion) {
        OrdenServicio orden = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Orden no encontrada con ID: " + id));

        if (orden.getIsReparacion() != isReparacion) {
            throw new NegocioException("No se puede eliminar: la orden no corresponde a este tipo de operación");
        }

        // Si el stock ya fue descontado (es reparación aprobada), lo reponemos antes de eliminar
        if (orden.getEstadoReparacion() == EstadoOrden.Aprobado_Presupuesto) {
            log.info("Reponiendo stock antes de eliminar la Orden ID: {}", id);
            for (DetalleOrdenServicio detalle : orden.getDetalles()) {
                if (detalle.getProducto() != null) {
                    reponerStock(detalle.getProducto().getId(), detalle.getCantidad());
                }
            }
        }
        
        repository.delete(orden);
    }
    
    // --> PUT de actualización general
    public OrdenServicioResponseDTO update(Long id, OrdenServicioRequestDTO request, boolean isReparacion) {
        OrdenServicio orden = repository.findById(id)
                .orElseThrow(() -> new NegocioException("Orden no encontrada con ID: " + id));
        
        if (orden.getIsReparacion() != isReparacion) {
            throw new NegocioException("Operación inválida: La orden no es del tipo correcto.");
        }

        // 1. IDENTIFICAR SI YA ESTÁ APROBADA
        boolean stockYaDescontado = (orden.getEstadoReparacion() == EstadoOrden.Aprobado_Presupuesto || 
                                     orden.getEstadoReparacion() == EstadoOrden.Finalizado);

        //  MEMORIA DE PRECIOS HISTÓRICOS ---
        // Guardamos los precios de los productos que ya estaban en la orden (ID Producto -> Precio Congelado)
        HashMap<Long, BigDecimal> preciosHistoricos = new HashMap<>();

        if (stockYaDescontado) {
            log.info("Reponiendo stock y guardando precios históricos para la Orden ID: {}", orden.getId());
            for (DetalleOrdenServicio detalleViejo : orden.getDetalles()) {
                if (detalleViejo.getProducto() != null) {
                    
                    // Guardamos el precio en nuestra memoria temporal
                    preciosHistoricos.put(detalleViejo.getProducto().getId(), detalleViejo.getValorUnitario());
                    
                    // Reponemos el stock
                    reponerStock(detalleViejo.getProducto().getId(), detalleViejo.getCantidad());
                }
            }
        }

        // 2. LIMPIAR LOS DETALLES VIEJOS
        orden.getDetalles().clear(); 

        // 3. ACTUALIZAR DATOS BÁSICOS (Con validación de nulos)
        orden.setObservacion(request.observacion());
        BigDecimal manoObra = request.valorManoDeObra() != null ? request.valorManoDeObra() : BigDecimal.ZERO;
        orden.setValorManoObra(manoObra);

        // 4. MAPEAR Y AGREGAR LOS NUEVOS DETALLES
        BigDecimal totalDetalles = BigDecimal.ZERO;
        if (request.detalles() != null) {
            for (DetalleOrdenServicioRequestDTO detDto : request.detalles()) {
                
                // Mapeamos (nace por defecto con el precio actual de la BD)
                DetalleOrdenServicio detalle = mapearDetalle(detDto); 
                
                // Si la orden ya era un presupuesto y el producto ya existía antes de la edición,
                // pisamos el precio nuevo con el precio histórico congelado.
                if (stockYaDescontado && preciosHistoricos.containsKey(detDto.idProducto())) {
                    detalle.setValorUnitario(preciosHistoricos.get(detDto.idProducto()));
                }

                orden.addDetalle(detalle);
                
                // Calculamos subtotal usando el precio final decidido
                BigDecimal subtotal = detalle.getValorUnitario().multiply(new BigDecimal(detDto.cantidad()));
                totalDetalles = totalDetalles.add(subtotal);
            }
        }

        // Recalculamos el total final
        orden.setValorTotal(totalDetalles.add(manoObra));

        // 5. VOLVER A DESCONTAR EL STOCK
        if (stockYaDescontado) {
            log.info("Descontando stock de los nuevos detalles para la Orden ID: {}", orden.getId());
            descuentoStock(orden);
        }

        return mapToDTO(repository.save(orden));
    }

    // --> PUT específico de cambiar de estado
    public OrdenServicioResponseDTO updateState(Long id) {
    OrdenServicio orden = repository.findById(id)
            .orElseThrow(() -> new NegocioException("Orden no encontrada con ID: " + id));

    EstadoOrden estadoActual = orden.getEstadoReparacion();

    // PASO 1: De Presupuesto a Reparación en curso
    if (estadoActual == EstadoOrden.Pendiente_Aprobacion) {
        orden.setIsReparacion(true);
        orden.setEstadoReparacion(EstadoOrden.Aprobado_Presupuesto);
        orden.setFechaConfirmacion_reparacion(LocalDateTime.now());
        
        // Es el momento de quitar las piezas del inventario
        descuentoStock(orden);
        log.info("Orden {}: Presupuesto aprobado -> Reparación en curso.", id);
    } 
    
    // PASO 2: De Reparación en curso a Finalizada
    else if (estadoActual == EstadoOrden.Aprobado_Presupuesto) {
        // Aquí ya no tocamos el stock, solo marcamos que el trabajo terminó
        orden.setEstadoReparacion(EstadoOrden.Finalizado);
        log.info("Orden {}: Trabajo terminado -> Finalizada.", id);
    } 
    
    else {
        throw new NegocioException("La orden ya está finalizada o en un estado inválido.");
    }

    return mapToDTO(repository.save(orden));
}


    /**
     * Lógica privada para interactuar descontando el stock de los productos involucrados en una orden de reparación aprobada. Se llama tanto al confirmar un presupuesto como al editar una reparación ya aprobada.
     */
    private void descuentoStock(OrdenServicio orden) {
        log.info("Iniciando descuento de stock para la Orden ID: {}", orden.getId());
        if (orden.getDetalles() != null) {
            for (DetalleOrdenServicio detalle : orden.getDetalles()) {
                if (detalle.getProducto() != null) {
                    productoService.descontarStock(
                        detalle.getProducto().getId(), 
                        new BigDecimal(detalle.getCantidad())
                    );
                }
            }
        }
        else {
            log.warn("La Orden ID: {} no tiene detalles para descontar stock", orden.getId());
        }
    }

    /**
     * Lógica privada para reponer stock en caso de eliminación o edición de una reparación que ya había descontado stock.
     */
    private void reponerStock(Long idProducto, Integer cantidad) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + idProducto));

        BigDecimal cantidadAReponer = new BigDecimal(cantidad);
        
        // Sumamos la cantidad de vuelta al stock actual
        producto.setStock(producto.getStock().add(cantidadAReponer));
        
        productoRepository.save(producto);
        log.info("Stock repuesto para el producto ID: {}. Cantidad: {}", idProducto, cantidad);
    }

    

    // --- MAPPERS Y DEMAPPER DTOS ---

    private OrdenServicioResponseDTO mapToDTO(OrdenServicio o) {
        
        DetalleOrdenServicioResponseDTO[] detallesArray = o.getDetalles().stream()
                .map(this::mapDetalleToDTO)
                .toArray(DetalleOrdenServicioResponseDTO[]::new);

        return OrdenServicioResponseDTO.builder()
                .id(o.getId())
                .estadoReparacion(o.getEstadoReparacion().name())
                .valorTotal(o.getValorTotal())
                .valorManoDeObra(o.getValorManoObra())
                .fechaCreacion(o.getFechaCreacion())
                .fechaConfirmada_reparacion(o.getFechaConfirmacion_reparacion())
                .observacion(o.getObservacion())
                .detalles(detallesArray) 
                .build();
    }

    private DetalleOrdenServicioResponseDTO mapDetalleToDTO(DetalleOrdenServicio d) {
        return DetalleOrdenServicioResponseDTO.builder()
                .idProducto(d.getProducto().getId())
                .nombreProducto(d.getProducto().getNombre()) 
                .cantidad(d.getCantidad())
                .valorVenta(d.getValorUnitario())
                .build();
    }

    private DetalleOrdenServicio mapearDetalle(DetalleOrdenServicioRequestDTO dto) {
        Producto producto = productoRepository.findById(dto.idProducto())
                .orElseThrow(() -> new NegocioException("Producto ID " + dto.idProducto() + " no existe"));
        
        DetalleOrdenServicio detalle = new DetalleOrdenServicio();
        detalle.setProducto(producto);
        detalle.setCantidad(dto.cantidad());
        detalle.setValorUnitario(producto.getPrecioVenta()); // Congelamos el precio actual
        return detalle;
    }
}