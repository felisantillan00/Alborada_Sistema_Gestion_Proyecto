package com.example.backend.service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.example.backend.dto.response.*;
import com.example.backend.exception.NegocioException;
import com.example.backend.dto.request.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;
import com.example.backend.model.*;
import lombok.extern.slf4j.Slf4j;
import com.example.backend.dto.*;
import java.util.List;
import java.math.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final ProveedorRepository proveedorRepository;

    public ProductoResponseDTO create(ProductoRequestDTO request) {
        // 1. Validar nombre obligatorio
        if (request.nombre() == null || request.nombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        // 2. Buscar relaciones
        Categoria categoria = categoriaRepository.findById(request.idCategoria())
                .orElseThrow(() -> new NegocioException("Categoría no encontrada"));

        Marca marca = marcaRepository.findById(request.idMarca())
                .orElseThrow(() -> new NegocioException("Marca no encontrada"));

        Proveedor proveedor = null;
        if (request.idProveedor() != null) {
            proveedor = proveedorRepository.findById(request.idProveedor())
                .orElseThrow(() -> new NegocioException("Proveedor no encontrado"));
        }
        // 4. Mapear y EMBELLECER
        Producto producto = new Producto();
        // APLICAMOS LA MAGIA ACÁ:
        producto.setNombre(capitalizarTexto(request.nombre())); 
        producto.setDescripcion(request.descripcion());
        producto.setStock(request.stock());
        producto.setStockMinimo(request.stockMinimo());
        producto.setMargenGanancia(request.margenGanancia());
        producto.setCategoria(categoria);
        producto.setMarca(marca);
        producto.setProveedor(proveedor);
        calcularPrecio(producto, request);

        Producto guardado = productoRepository.save(producto);
        return mapToResponse(guardado);
    }

    // --- 2. LISTAR ---
    public List<ProductoResponseDTO> listAll() {
        return productoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- 3. BUSCAR POR ID, Codigo de barras, nombre, etc --
    public List<ProductoResponseDTO> findProducts(String termino) {
        List<Producto> resultados = productoRepository.buscarPorNombre(termino);

        if (termino.matches("\\d+") && resultados.isEmpty()) {
            productoRepository.findById(Long.valueOf(termino))
                    .ifPresent(resultados::add);
        }

        return resultados.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // --- 4. BUSCAR POR ID ---
    public ProductoResponseDTO findById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Producto no encontrado"));
        return mapToResponse(producto);
    }

    // --- 5. UPDATE ---
    public ProductoResponseDTO update(Long id, ProductoRequestDTO request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + id));
        // 1. Validar nombre y Embellecer
        if (request.nombre() != null && !request.nombre().isBlank()) {
            producto.setNombre(capitalizarTexto(request.nombre()));
        }
        // 3. Actualizar resto de campos simples
        if (request.descripcion() != null) {
            producto.setDescripcion(request.descripcion());
        }

        if (request.stock() != null) {
            producto.setStock(request.stock());
        }
        if (request.stockMinimo() != null) {
            producto.setStockMinimo(request.stockMinimo());
        }
        calcularPrecio(producto, request);
        // 4. Actualizar relaciones
        if (request.idCategoria() != null) {
            Categoria categoria = categoriaRepository.findById(request.idCategoria())
                    .orElseThrow(() -> new NegocioException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }
        if (request.idMarca() != null) {
            Marca marca = marcaRepository.findById(request.idMarca())
                    .orElseThrow(() -> new NegocioException("Marca no encontrada"));
            producto.setMarca(marca);
        }
        if (request.idProveedor() != null) {
            Proveedor proveedor = proveedorRepository.findById(request.idProveedor())
                    .orElseThrow(() -> new NegocioException("Proveedor no encontrado"));
            producto.setProveedor(proveedor);
        }

        Producto actualizado = productoRepository.save(producto);
        return mapToResponse(actualizado);
    }
    
    // --- 6. DELETE ---
    public ProductoResponseDTO delete(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + id));
        productoRepository.delete(producto);
        return mapToResponse(producto);
    }

    // Funcion para calcular el precio de venta
    private void calcularPrecio(Producto producto, ProductoRequestDTO request) {
        // 1. Lógica de "Fusión": Si el request trae el valor lo usamos, sino mantenemos el del producto
        BigDecimal costoFinal = (request.precioCosto() != null) 
                                ? request.precioCosto() 
                                : producto.getPrecioCosto();
                                
        BigDecimal margenFinal = (request.margenGanancia() != null) 
                                ? request.margenGanancia() 
                                : producto.getMargenGanancia();

        BigDecimal ventaFinal = (request.precioVenta() != null) 
                                ? request.precioVenta() 
                                : producto.getPrecioVenta();

        // Seteamos los valores base actualizados en la entidad
        producto.setPrecioCosto(costoFinal);

        // 2. Ejecutamos la lógica según lo que el usuario quiera priorizar
        
        // CASO A: Prioridad al MARGEN (Si viene en el request o ya existía)
        if (margenFinal != null && margenFinal.compareTo(BigDecimal.ZERO) > 0) {
            producto.setMargenGanancia(margenFinal);
            
            // FÓRMULA: Costo + (Costo * Margen / 100)
            BigDecimal ganancia = costoFinal
                    .multiply(margenFinal)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            
            producto.setPrecioVenta(costoFinal.add(ganancia));
        } 
        
        // CASO B: Prioridad al PRECIO VENTA MANUAL (Si no hay margen pero hay precio venta)
        else if (ventaFinal != null) {
            producto.setPrecioVenta(ventaFinal);
            
            // Recalculamos el margen para que no quede desactualizado en la BD
            if (costoFinal != null && costoFinal.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal gananciaAbsoluta = ventaFinal.subtract(costoFinal);
                BigDecimal margenCalculado = gananciaAbsoluta
                        .divide(costoFinal, 2, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
                
                producto.setMargenGanancia(margenCalculado);
            }
        }
        
        // CASO C: Venta al costo 
        else {
            producto.setPrecioVenta(costoFinal);
            producto.setMargenGanancia(BigDecimal.ZERO);
        }
    }

    // Método auxiliar para no repetir código en el GetById o GetAll
    private ProductoResponseDTO mapToResponse(Producto p) {
        ProductoResponseDTO response = new ProductoResponseDTO();
        // --- Campos simples (esto queda igual) ---
        response.setId(p.getId());
        response.setNombre(p.getNombre());
        response.setDescripcion(p.getDescripcion());
        response.setPrecioCosto(p.getPrecioCosto());
        response.setPrecioVenta(p.getPrecioVenta());
        response.setStock(p.getStock());

        // 1. Mapear Categoría (creamos el objetito y lo metemos dentro)
        if (p.getCategoria() != null) {
            CategoriaDTO catDto = new CategoriaDTO();
            catDto.setId(p.getCategoria().getId());
            catDto.setNombre(p.getCategoria().getNombre());
            catDto.setDescripcion(p.getCategoria().getDescripcion());
            response.setNombreCategoria(catDto.getNombre()); 
        }
        
        // 2. Mapear Marca
        if (p.getMarca() != null) {
            MarcaDTO marcaDto = new MarcaDTO();
            marcaDto.setId(p.getMarca().getId());
            marcaDto.setNombre(p.getMarca().getNombre());
            response.setNombreMarca(marcaDto.getNombre());
        }

        // 3. Mapear Proveedor
        if (p.getProveedor() != null) {
            ProveedorDTO provDto = new ProveedorDTO();
            provDto.setId(p.getProveedor().getId());
            provDto.setNombre(p.getProveedor().getNombre());
            provDto.setCuit(p.getProveedor().getCuit());
            provDto.setTelefono(p.getProveedor().getTelefono());
            provDto.setEmail(p.getProveedor().getEmail());
            provDto.setDireccion(p.getProveedor().getDireccion());
            provDto.setObservacion(p.getProveedor().getObservacion());
            response.setNombreProveedor(provDto.getNombre());
        }
        return response;
    }

    // Método auxiliar para capitalizar cada palabra
    private String capitalizarTexto(String texto) {
        if (texto == null || texto.isEmpty()) {
            return texto;
        }
        
        String[] palabras = texto.trim().toLowerCase().split("\\s+");
        StringBuilder resultado = new StringBuilder();

        for (String palabra : palabras) {
            if (!palabra.isEmpty()) {
                resultado.append(Character.toUpperCase(palabra.charAt(0)))
                .append(palabra.substring(1))
                .append(" ");
            }
        }
        return resultado.toString().trim();
    }

    public void descontarStock(Long idProducto, BigDecimal cantidadAVender) {
        // 1. Validar cantidad lógica
        // Traducido: si cantidadAVender.comparadoCon(0) es menor o igual a 0
        if (cantidadAVender.compareTo(BigDecimal.ZERO) <= 0) {
            throw new NegocioException("La cantidad a vender debe ser mayor a cero.");
        }

        // 2. Buscar producto
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new NegocioException("Producto no encontrado con ID: " + idProducto));

        // 3. VALIDACIÓN DE STOCK
        // Traducido: si stock.comparadoCon(cantidad) es menor a 0 (o sea, stock < cantidad)
        if (producto.getStock().compareTo(cantidadAVender) < 0) {
            throw new NegocioException(
                String.format("Stock insuficiente para el producto '%s'. Actual: %s, Solicitado: %s", 
                producto.getNombre(), producto.getStock(), cantidadAVender)
            );
        }

        // 4. Descontar y Guardar
        // Traducido: stock.restar(cantidad)
        producto.setStock(producto.getStock().subtract(cantidadAVender));
        productoRepository.save(producto);
        
        // Opcional: Alerta de mínimo
        // Validamos que stockMinimo no sea null para evitar NullPointer
        if (producto.getStockMinimo() != null && 
            producto.getStock().compareTo(producto.getStockMinimo()) <= 0) {
            log.warn("ALERTA STOCK: El producto {} quedó por debajo del mínimo.", producto.getNombre());
        }
    }
}