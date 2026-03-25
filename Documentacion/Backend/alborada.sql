-- 1. INSERTAR DATOS MAESTROS (Marcas y Categorías extraídas del Excel)
INSERT IGNORE INTO marca (nombre) VALUES ('SPY'), ('SLP'), ('SHIMANO'), ('VENZO'), ('MAXXIS');

INSERT IGNORE INTO categoria (nombre) VALUES ('ADAPTADORES'), ('AMORTIGUADORES'), ('ASIENTOS'), ('CUBIERTAS');

-- 2. INSERTAR PROVEEDOR POR DEFECTO (Para PuntoFix)
INSERT IGNORE INTO proveedor (nombre, cuit) VALUES ('Distribuidora General', '20-00000000-1');


INSERT INTO producto (nombre, descripcion, precio_costo, margen_ganancia, precio_venta, stock, stock_minimo, id_categoria, id_marca)
VALUES (
    'ADAPTADOR PROLONGADOR DE VÁLVULA', 
    'Código: A00 005 7001', 
    2000.00, 35.0, 2700.00, 10, 2,
    (SELECT id FROM categoria WHERE nombre = 'ADAPTADORES' LIMIT 1),
    (SELECT id FROM marca WHERE nombre = 'SHIMANO' LIMIT 1)
);

INSERT INTO producto (nombre, descripcion, precio_costo, margen_ganancia, precio_venta, stock, stock_minimo, id_categoria, id_marca)
VALUES (
    'AMORTIGUADOR ECON. 150MM DURAL', 
    'Código: A01 023 0140', 
    8000.00, 40.0, 11200.00, 5, 1,
    (SELECT id FROM categoria WHERE nombre = 'AMORTIGUADORES' LIMIT 1),
    (SELECT id FROM marca WHERE nombre = 'VENZO' LIMIT 1)
);

INSERT INTO producto (nombre, descripcion, precio_costo, margen_ganancia, precio_venta, stock, stock_minimo, id_categoria, id_marca)
VALUES (
    'ASIENTOS PLAYERA Resorte SPY', 
    'Mediano Spy - Código: A01 040 0145', 
    11200.00, 41.96, 15900.00, 8, 2,
    (SELECT id FROM categoria WHERE nombre = 'ASIENTOS' LIMIT 1),
    (SELECT id FROM marca WHERE nombre = 'SPY' LIMIT 1)
);

INSERT INTO producto (nombre, descripcion, precio_costo, margen_ganancia, precio_venta, stock, stock_minimo, id_categoria, id_marca)
VALUES (
    'ASIENTOS PLAYERO SLP SIN RESORTE', 
    'Código: A01 025 0120', 
    9500.00, 45.0, 13775.00, 12, 3,
    (SELECT id FROM categoria WHERE nombre = 'ASIENTOS' LIMIT 1),
    (SELECT id FROM marca WHERE nombre = 'SLP' LIMIT 1)
);