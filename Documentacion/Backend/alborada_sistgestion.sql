-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 26, 2026 at 02:18 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alborada_sistgestion`
--

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`id`, `descripcion`, `nombre`) VALUES
(21, NULL, 'ADAPTADORES'),
(22, NULL, 'AMORTIGUADOR'),
(23, NULL, 'ASIENTOS'),
(24, NULL, 'ASIENTOS MTB/BMX'),
(25, NULL, 'BOLILLAS'),
(26, NULL, 'CABLES'),
(27, NULL, 'CADENAS'),
(28, NULL, 'CAJAS DE CENTRO'),
(29, NULL, 'CAMBIOS'),
(30, NULL, 'MANIJAS CAMBIOS'),
(31, NULL, 'FUSIBLES'),
(32, NULL, 'CANASTOS'),
(40, NULL, 'CAÑOS'),
(41, NULL, 'CIERRES TORNILLOS'),
(42, NULL, 'COLLARES'),
(43, NULL, 'CONOS'),
(44, NULL, 'CONTRATUERCAS'),
(45, NULL, 'CUBETAS MAZA'),
(46, NULL, 'CUBREASIENTOS'),
(47, NULL, 'CUBRECADENAS'),
(48, NULL, 'DESCARRILADORES'),
(49, NULL, 'EJES'),
(50, NULL, 'ENGRANAJES'),
(51, NULL, 'PALANCAS'),
(52, NULL, 'ESPEJOS'),
(53, NULL, 'ESTABILIZADORES'),
(54, NULL, 'FORMAS'),
(55, NULL, 'FRENOS'),
(56, NULL, 'MANIJAS DE FRENO'),
(57, NULL, 'CALIPER'),
(58, NULL, 'DISCO FRENO'),
(59, NULL, 'HORQUILLAS'),
(60, NULL, 'INFLADORES'),
(61, NULL, 'JUEGOS DE DIRECCION'),
(62, NULL, 'JAULAS'),
(63, NULL, 'LINGAS'),
(64, NULL, 'LLANTAS'),
(65, NULL, 'MAZAS'),
(66, NULL, 'OJOS DE GATO'),
(67, NULL, 'PATINES DE FRENO'),
(68, NULL, 'PASTILLAS DE FRENO'),
(69, NULL, 'PEDALES'),
(70, NULL, 'PEDALINES'),
(71, NULL, 'PIÑONES'),
(72, NULL, 'PORTAEQUIPAJES'),
(73, NULL, 'PUNTERAS'),
(74, NULL, 'PUÑOS'),
(75, NULL, 'REGULADORES'),
(76, NULL, 'RAYOS'),
(77, NULL, 'RUEDAS'),
(78, NULL, 'SOPORTES PIE'),
(79, NULL, 'STEMS'),
(80, NULL, 'TORNILLOS'),
(81, NULL, 'TUERCAS'),
(82, NULL, 'UNIONES'),
(83, NULL, 'VALVULAS'),
(84, NULL, 'VARILLAS'),
(85, NULL, 'CAMARAS'),
(86, NULL, 'CUBIERTAS');

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `id` bigint NOT NULL,
  `cantidad_total` int NOT NULL,
  `fecha_compra` datetime(6) NOT NULL,
  `total_compra` decimal(10,2) DEFAULT NULL,
  `proveedor_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `compra_id` bigint NOT NULL,
  `producto_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id` bigint NOT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(38,2) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  `id_producto` bigint DEFAULT NULL,
  `id_venta` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marca`
--

CREATE TABLE `marca` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `marca`
--

INSERT INTO `marca` (`id`, `descripcion`, `nombre`) VALUES
(29, NULL, 'SPY'),
(30, NULL, 'SLP'),
(31, NULL, 'CICLOTURISMO'),
(32, NULL, 'CENTURY'),
(33, NULL, 'FOSADDLE'),
(34, NULL, 'EL MIGUELITO'),
(35, NULL, 'GENERICA'),
(36, NULL, 'SHIMANO'),
(37, NULL, 'TAYA'),
(38, NULL, 'TEC'),
(39, NULL, 'MAYA'),
(40, NULL, 'TIMALO'),
(41, NULL, 'TOP MEGA'),
(42, NULL, 'LXIANG'),
(43, NULL, 'SENSAH'),
(44, NULL, 'AZONIC'),
(45, NULL, 'MKR'),
(46, NULL, 'SKINREAD'),
(58, NULL, 'SLP'),
(59, NULL, 'SHIMANO'),
(60, NULL, 'NECO'),
(61, NULL, 'TOP MEGA'),
(62, NULL, 'REARTE'),
(63, NULL, 'ECLIPSE'),
(64, NULL, 'SENSAH'),
(65, NULL, 'DEORE'),
(66, NULL, 'LXIANG'),
(67, NULL, 'NECO'),
(68, NULL, 'BIANCHI'),
(69, NULL, 'KALOY'),
(70, NULL, 'VENZO'),
(71, NULL, 'VENZO'),
(72, NULL, 'SLP'),
(73, NULL, 'BKZAM'),
(74, NULL, 'EASTMAN'),
(75, NULL, 'SHIMANO'),
(76, NULL, 'TOPMEGA'),
(77, NULL, 'MAXXUM'),
(78, NULL, 'BETO'),
(79, NULL, 'DONCA'),
(80, NULL, 'NECO'),
(81, NULL, 'DAKOTA'),
(82, NULL, 'LIBERCAM'),
(83, NULL, 'MEROCA'),
(84, NULL, 'XERAMA'),
(85, NULL, 'NECO'),
(86, NULL, 'SHIMANO'),
(87, NULL, 'SUGEK'),
(88, NULL, 'MAXXUM'),
(89, NULL, 'FIREBIRD'),
(90, NULL, 'REARTE'),
(91, NULL, 'PIRELLI'),
(92, NULL, 'ARISUN'),
(93, NULL, 'OBOR'),
(94, NULL, 'TRI-DIAMOND'),
(95, NULL, 'IMPERIAL');

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `id` bigint NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `margen_ganancia` decimal(38,2) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio_costo` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `stock` decimal(38,2) DEFAULT NULL,
  `stock_minimo` decimal(38,2) DEFAULT NULL,
  `id_categoria` bigint NOT NULL,
  `id_marca` bigint NOT NULL,
  `id_proveedor` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id`, `descripcion`, `margen_ganancia`, `nombre`, `precio_costo`, `precio_venta`, `stock`, `stock_minimo`, `id_categoria`, `id_marca`, `id_proveedor`) VALUES
(38, 'C/U', 40.00, 'ADAPTADOR PROLONGADOR DE VÁLVULA', 0.00, 0.00, NULL, NULL, 21, 35, 1),
(39, 'C/U', 40.00, 'ADAPTADOR P/VÁLVULA AUTO CORTO', 2000.00, 2800.00, NULL, NULL, 21, 35, 1),
(40, '11-001-IC04-164897/B C/U', 40.00, 'ADAPTADOR FRENTE OVERSIDE', 0.00, 0.00, NULL, NULL, 21, 35, 2),
(41, '18-001-IC04-197270/D C/U', 40.00, 'AMORTIGUADOR ECON. 150MM DURAL', 0.00, 0.00, NULL, NULL, 22, 35, 1),
(42, 'C/U', 40.00, 'ASIENTOS PASEO/PLAYEROS', 0.00, 0.00, NULL, NULL, 23, 35, 1),
(43, 'Mediano Spy - Mercado libre', 41.96, 'ASIENTOS PLAYERA Resorte SPY', 11200.00, 15900.00, NULL, NULL, 23, 29, 1),
(44, '16-001-I03086/ - Mercado libre', 26.12, 'ASIENTOS PLAYERO slp SIN RESORTE', 9911.00, 12500.00, NULL, NULL, 23, 30, 1),
(45, 'Mercado libre - C/U', 39.83, 'ASIENTOS PLAYERO Cicloturismo C/RESORTES', 11800.00, 16500.00, NULL, NULL, 23, 31, 1),
(46, '18-001-IC04-2228 - Mercado libre', 31.81, 'ASIENTOS PLAY C/Resorte Elastomero MTB', 17450.00, 23000.00, NULL, NULL, 23, 35, 1),
(47, 'MEIDE - Mercado libre', 46.67, 'ASIENTOS MTB SLP Clasico CENTURY', 7500.00, 11000.00, NULL, NULL, 24, 30, 1),
(48, 'FOSADDLE - Mercado libre', 40.00, 'ASIENTOS MTB acolchado', 6136.00, 8590.00, NULL, NULL, 24, 33, 1),
(49, 'QIUSHUAI - Mercado libre', 40.71, 'ASIENTOS MTB ANTIPROSTATICO SPY', 11300.00, 15900.00, NULL, NULL, 24, 29, 1),
(50, 'EL MIGUELITO (DELFÍN)', 40.00, 'ASIENTOS MTB NIÑO PLAYERA 16-20', 0.00, 0.00, NULL, NULL, 24, 34, 1),
(51, '20-001-IC04-0/K - Mercado libre', 45.00, 'ASIENTOS MTB SLP ACOLCHADO', 10000.00, 14500.00, NULL, NULL, 24, 30, 1),
(52, '20-001-IC04-084045/K', 40.00, 'ASIENTOS MTB ANTIPROSTATICO ANGOSTO', 0.00, 0.00, NULL, NULL, 24, 35, 1),
(53, 'C/U', 40.00, 'BOLILLAS DE ACERO DE 1/8', 0.00, 50.00, NULL, NULL, 25, 35, 1),
(54, 'EMB.IC04-007710-D/01', 40.00, 'BOLILLAS DE ACERO DE 5/32', 0.00, 0.00, NULL, NULL, 25, 35, 1),
(55, '15-091-IC04-002996/F - GRS', 40.00, 'BOLILLAS DE ACERO DE 3/16', 0.00, 0.00, NULL, NULL, 25, 35, 1),
(56, '17-001-IC04-048590/V - GRS', 40.00, 'BOLILLAS DE ACERO DE 7/32', 0.00, 0.00, NULL, NULL, 25, 35, 1),
(57, '15-091-IC04-002996/F - GRS', 40.00, 'BOLILLAS DE ACERO DE 1/4', 0.00, 0.00, NULL, NULL, 25, 35, 1),
(58, 'EMB.71239-3/97 - GRS', 40.00, 'BOLILLAS DE ACERO DE 5/16', 0.00, 0.00, NULL, NULL, 25, 35, 1),
(59, '17-001-IC04-167772/C - C/U', 40.00, 'CABLE DE CAMBIO LARGO (2,10) SHIMANO', 0.00, 0.00, NULL, NULL, 26, 36, 1),
(60, '17-001-IC04-048590/V - C/U', 40.00, 'CABLE DE CAMBIO LARGO (2,10)', 2000.00, 2800.00, NULL, NULL, 26, 35, 1),
(61, '(LARGO 2,20) TAMBOR - C/U', 40.00, 'CABLE DE FRENO TRASERO SUPER LARGO', 2000.00, 2800.00, NULL, NULL, 26, 35, 1),
(62, '( Ø 6 x 0,80 MTS.) 300 - C/U', 40.00, 'CABLE DE FRENO DELANTERO BMX/MTB', 1200.00, 1680.00, NULL, NULL, 26, 35, 1),
(63, 'Largo 1,70 Mts - Mercado libre', 40.00, 'CABLE DE FRENO TRASERO BMX/MTB', 2993.00, 4190.00, NULL, NULL, 26, 35, 1),
(64, 'BALANCIN - Mercado libre', 42.22, 'Cable Puente Tirador Freno Cantilever', 2250.00, 3200.00, NULL, NULL, 26, 35, 1),
(65, '18-001-IC04 4/T - Mercado libre', 40.49, 'CADENA ½x1/8x108 Eslabones 1 V paseo', 5623.00, 7900.00, NULL, NULL, 27, 35, 1),
(66, '18-001-IC04-108374/T - C/U', 40.00, 'CADENA ½x1/8x114 ESL. ANCHA TAYA', 0.00, 0.00, NULL, NULL, 27, 37, 1),
(67, 'TEC c30 - Mercado libre', 58.16, 'CADENA P.FINO HG40 6/7/8 V 116esl.', 5564.00, 8800.00, NULL, NULL, 27, 38, 1),
(68, '18-001-IC0474/T - Mercado libre', 58.03, 'CADENA P.FINO 116 Esl OCTO MAYA Chain', 4999.00, 7900.00, NULL, NULL, 27, 39, 1),
(69, '18-0C04-108374/ - Mercado libre', 28.59, 'CADENA P.FINO HV500 7-8-9 VELOC.', 7699.00, 9900.00, NULL, NULL, 27, 35, 1),
(70, '7,8,9,21v - C/U', 41.57, 'Cadena Bicicleta Slp M30 114 Eslab', 3885.00, 5500.00, NULL, NULL, 27, 30, 1),
(77, '16-001-IC04-1/M - Mercado libre', 105.36, 'CAJA CENTRAL Timalo 35/36MM BKZAM', 5600.00, 11500.00, NULL, NULL, 28, 40, 1),
(78, '11-001-IC0 6/G - C/U', 47.83, 'CAJA CENTRAL Slp c/RULEMAN Izq-Der', 9200.00, 13600.00, NULL, NULL, 28, 30, 1),
(79, '18-001-IC - C/U', 37.21, 'CAJA CENTRAL TOP MEGA 34,7 Sellada', 12900.00, 17700.00, NULL, NULL, 28, 41, 1),
(80, '118MM Der-Der - C/U', 44.44, 'CAJA CENTRAL SEMISELLADA 35 MM', 12600.00, 18200.00, NULL, NULL, 28, 35, 1),
(81, '18-001-IC04-075566/C', 40.00, 'CAJA DE CENTRO SHIMANO UN26 36 MM', 0.00, 0.00, NULL, NULL, 28, 36, 1),
(88, '13-001-I04-131/K - C/U', 40.00, 'CAMBIO con Gancho LXIANG 6-7-13v', 7500.00, 10500.00, NULL, NULL, 29, 42, 1),
(89, '16-001-IC046/Y - C/U', 45.65, 'CAMBIO Sin Gancho SLP', 6660.00, 9700.00, NULL, NULL, 29, 30, 1),
(90, 'Ss Corto 34 T - C/U', 37.72, 'Cambio Trasero Shimano Tourney Ty200', 16700.00, 23000.00, NULL, NULL, 29, 36, 1),
(91, '19-001-IC04-1/ - C/U', 22.46, 'MANIJAS CAMBIO SHIMANO 21 vel (botón)', 23600.00, 28900.00, NULL, NULL, 30, 36, 1),
(92, 'palanquita - JGO', 50.04, 'Manijas Cambio Shifter Sensah', 19995.00, 30000.00, NULL, NULL, 30, 43, 1),
(93, '18-001-IC - JGO', 33.06, 'Manijas CAMBIO c/ freno tipo SHIMANO', 24800.00, 33000.00, NULL, NULL, 30, 36, 1),
(94, 'AZONIC, VENZO, MKR, SKINREAD', 38.89, 'FUSIBLES PARA CUADROS VARIOS', 9000.00, 12500.00, NULL, NULL, 31, 70, 1),
(95, 'ROD.26 B.M. - C/U', 42.32, 'CANASTOS PLASTICOS GRANDES AL EJE', 12999.00, 18500.00, NULL, NULL, 32, 35, 1),
(96, 'ROD.26 - C/U', 43.41, 'CANASTOS PLASTICOS NEGRO TRASERO', 12900.00, 18500.00, NULL, NULL, 32, 35, 1),
(97, 'PLANCHUELA - C/U', 40.00, 'SOPORTE para CANASTO eje Delantero', 2500.00, 3500.00, NULL, NULL, 32, 35, 1),
(102, '25,4 a 31,6 - 20-001-IC04', 40.00, 'CAÑO PORTASILLA DURAL MTB C/MORD.', 9950.00, 13930.00, NULL, NULL, 40, 35, 1),
(103, 'con corredera - E.IC04-119677', 36.36, 'CAÑO PORTASILLA 27,2x300 Slp', 9900.00, 13500.00, NULL, NULL, 40, 30, 1),
(104, 'Ø 26,2 Y 25,4 MM SPORT', 40.19, 'CAÑOS PORTASILLA ACERO 19CM.', 5350.00, 7500.00, NULL, NULL, 40, 35, 1),
(105, 'Ø 25,4 MM - LARGO', 40.00, 'CAÑOS PORTASILLA ACERO 30CM.', 7000.00, 9800.00, NULL, NULL, 40, 35, 1),
(106, 'Negro - ML2999', 73.39, 'CIERRES P/COLLAR A PRESION Aluminio', 2999.00, 5200.00, NULL, NULL, 41, 35, 1),
(107, 'CROMADO O NEGRO', 115.38, 'COLLAR DE ASIENTO C/BULON ACERO', 1300.00, 2800.00, NULL, NULL, 42, 35, 1),
(108, '20-001-IC04-054535/L', 41.67, 'COLLAR DE ASIENTO ALUMIINIO C/CIERRE', 6000.00, 8500.00, NULL, NULL, 42, 35, 1),
(109, 'DEL. O TRAS. C/O-RING', 50.00, 'CONOS DE EJE SHIMANO RECTIFICADO', 1000.00, 1500.00, NULL, NULL, 43, 36, 1),
(110, 'C/Guardapolv - EMB.08-001', 60.00, 'CONOS DE MAZA DELANT. Ø 5/16', 1500.00, 2400.00, NULL, NULL, 43, 35, 1),
(111, 'PLASTICA - PAR', 42.86, 'CUBETAS DE RUEDA DELANTERA BMX 12', 3500.00, 5000.00, NULL, NULL, 45, 35, 1),
(112, '14-001-IC04-246/', 42.05, 'DESCARRILADOR MTB Shimano Tourney', 8800.00, 12500.00, NULL, NULL, 48, 36, 1),
(113, '18-001-IC0', 69.23, 'DESCARRILADOR MTB TIRO INFERIOR', 6500.00, 11000.00, NULL, NULL, 48, 35, 1),
(114, '165MM - ML7482', 93.79, 'Biela Playera Tipo Kaloy works', 7482.00, 14500.00, NULL, NULL, 49, 69, 1),
(115, '19-001-IC04-6/N', 40.00, 'EJE DE CENTRO Chaveta COMUN Nº69', 3700.00, 5180.00, NULL, NULL, 49, 35, 1),
(116, 'conos-guardap - ml2500', 196.00, 'EJE DE MAZA TRASERO 3/8 REARTE', 2500.00, 7400.00, NULL, NULL, 49, 62, 1),
(117, '16-001-IC04-4 - SHIMANO', 40.74, 'ENG.Y PAL.DURAL TY-701 TRIPLE MTB', 13500.00, 19000.00, NULL, NULL, 50, 36, 1),
(118, 'C/CUBRE - 9390mL', 38.45, 'ENG.Y Palnaca-cuadrado 44/48D', 9390.00, 13000.00, NULL, NULL, 50, 35, 1),
(119, '20-IC04-054535 / 4945ML', 39.53, 'PALANCAS ACERO IZQ. P/EJE CUADRADO', 4945.00, 6900.00, NULL, NULL, 51, 35, 1),
(120, 'ROD.14/16/20 - ML8500', 41.18, 'ESTABILIZADORES FIJOS C/R. PLATASTICO', 8500.00, 12000.00, NULL, NULL, 53, 35, 1),
(121, '14/16/20 - ml16800', 39.88, 'ESTABILIZADORES REGISTRABLES', 16800.00, 23500.00, NULL, NULL, 53, 35, 1),
(122, 'C/U', 40.00, 'FORMAS ACERO CROM. PLEG.', 16000.00, 22400.00, NULL, NULL, 54, 35, 1),
(123, 'EMB.IC04-1 - ML7500', 108.00, 'FORMAS ACERO MTB RECTAS', 7500.00, 15600.00, NULL, NULL, 54, 35, 1),
(124, '20-001-IC04-054535/L - 12909ML', 43.31, 'FORMAS SLP PARA STEMS 31,8mm', 12909.00, 18500.00, NULL, NULL, 54, 30, 1),
(125, '16-001-IC04 - MTS', 40.00, 'FORRO DE FRENO Ø 3 MM Trasero', 1215.00, 1700.00, NULL, NULL, 55, 35, 1),
(126, '18-001-IC04-1 - ML7900', 40.51, 'MANIJAS FRENO MTB Aluminio', 7900.00, 11100.00, NULL, NULL, 56, 35, 1),
(127, 'SHIMANO - 19-001-IC04', 40.00, 'FRENOS A DISCO MT200 HIDRAULICO', 0.00, 0.00, NULL, NULL, 55, 36, 1),
(128, 'SIN ADAPTADOR - 22800Ml', 27.19, 'Caliper De Freno Topmega Del. Tras.', 22800.00, 29000.00, NULL, NULL, 57, 76, 1),
(129, 'dsc frn160/ - 9317Ml', 38.46, 'Disco Freno Bicicleta 160mm Acero', 9317.00, 12900.00, NULL, NULL, 58, 35, 1),
(130, '11-001-1697/B - tucu17529', 59.74, 'INFLADOR BETO Taller', 17529.00, 28000.00, NULL, NULL, 60, 78, 1),
(131, '17-001-IC04 - ML9999', 40.06, 'INFLADOR DONCA 35 cm MINI', 3570.00, 5000.00, NULL, NULL, 60, 79, 1),
(132, 'BKZAM - ML5000', 96.00, 'JGOS.DIRECCION ACERO SEMI-INTEGRADO', 5000.00, 9800.00, NULL, NULL, 61, 73, 1),
(133, 'Aro Simple - 12749ML', 45.11, 'LLANTAS Aluminio ROD.26x1.90 MTB', 12749.00, 18500.00, NULL, NULL, 64, 35, 1),
(134, '36 Agujeros Timalo - 21999Ml', 31.82, 'LLANTAS DURAL MTB Doble pared R29', 21999.00, 29000.00, NULL, NULL, 64, 35, 1),
(135, '17-001-IC04 - 17900ml', 35.20, 'MAZAS ACERO C/FRENO CONTRAPEDAL', 17900.00, 24200.00, NULL, NULL, 65, 35, 1),
(136, '2218 Del/Tras - ml11465', 43.92, 'Kit Luces Usb Led Bici Dakota', 11465.00, 16500.00, NULL, NULL, 66, 81, 1),
(137, '18-001-IC04 - 2450 ML', 59.18, 'PATINES DE FRENO V-BRAKE tuerca alem', 2450.00, 3900.00, NULL, NULL, 67, 35, 1),
(138, 'mjal02 - 7438ml', 31.76, 'Pastillas De Freno Rect. Meroca', 7438.00, 9800.00, NULL, NULL, 68, 83, 1),
(139, 'ML5325DXVB - 3380ml', 113.02, 'Pastilla De Frenos Para Mtb Shimano', 3380.00, 7200.00, NULL, NULL, 68, 36, 1),
(140, '11-001-IC04 - 4050ml', 43.21, 'PEDALES PLAST. PLAYERO FREESTYLE', 4050.00, 5800.00, NULL, NULL, 69, 35, 1),
(141, 'C/REFLEX - 9500ml', 42.11, 'PEDALES Aluminio MTB C/BOL.', 9500.00, 13500.00, NULL, NULL, 69, 35, 1),
(142, '9/16 Hexagonal - 12589.00', 39.80, 'PEDALES Neco Wp303 Aluminio', 12589.00, 17600.00, NULL, NULL, 69, 60, 1),
(143, '18, 20 ó 22 DTES. - 1600ml', 75.00, 'PIÑONES PLAYEROS Contrapedal', 1600.00, 2800.00, NULL, NULL, 71, 35, 1),
(144, '18-001-IC04-116453/Z', 40.00, 'PIÑONES DE 6 V. SHIMANO', 4800.00, 6720.00, NULL, NULL, 71, 36, 1),
(145, '17-001-IC04 - tucu15966', 39.67, 'PIÑONES A CASSETTE 8V. RUTA SUGEK', 15966.00, 22300.00, NULL, NULL, 71, 87, 1),
(146, 'Armada Aluminio', 61.58, 'RUEDAS MTB DURAL TRASERA 26', 27850.00, 45000.00, NULL, NULL, 77, 35, 1),
(147, 'Trasera - 47000ml', 40.00, 'RUEDAS CONTRAPEDAL DURAL PLAYERA', 47000.00, 65800.00, NULL, NULL, 77, 35, 1),
(148, 'Regulable Reforzado - 8980ML', 39.20, 'SOPORTE PIE Alumino a la Caja', 8980.00, 12500.00, NULL, NULL, 78, 35, 1),
(149, '18-001-IC04 - 6573ml', 39.97, 'STEM DURAL BMX AHEAD', 6573.00, 9200.00, NULL, NULL, 79, 35, 1),
(150, '28.6mm - 2278ML', 53.64, 'Araña Firebird Para Ahead Stem', 2278.00, 3500.00, NULL, NULL, 79, 89, 1),
(151, 'VASK3600 - tucu4176', 55.65, 'CAMARAS 26x1,90 VALVULA MOTO', 4176.00, 6500.00, NULL, NULL, 85, 35, 1),
(152, '48 mm importada - 6500ml', 50.77, 'CAMARAS 29x2.00 Valvula Presta', 6500.00, 9800.00, NULL, NULL, 85, 35, 1),
(153, 'ROSETERA - tucu14715', 63.10, 'CUBIERTAS 26 x 1,95 MTB IMP CORD', 14715.00, 24000.00, NULL, NULL, 86, 95, 1),
(154, 'MountEmmons - ml16500', 51.52, 'CUBIERTAS 26 x 2,10 Mtb Arisun', 16500.00, 25000.00, NULL, NULL, 86, 92, 1),
(155, '50-622 - 22400ML', 27.23, 'CUBIERTAS 29 x 2,10 OBOR BILLY GOAT', 22400.00, 28500.00, NULL, NULL, 86, 93, 1);

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `id` bigint NOT NULL,
  `cuit` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`id`, `cuit`, `direccion`, `email`, `nombre`, `observacion`, `telefono`) VALUES
(1, NULL, NULL, NULL, 'Proveedor Genérico', 'Local', NULL),
(2, NULL, NULL, NULL, 'Mercado Libre', 'Plataforma Online', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `venta`
--

CREATE TABLE `venta` (
  `id` bigint NOT NULL,
  `fecha_venta` datetime(6) DEFAULT NULL,
  `forma_pago` enum('EFECTIVO','TRANSFERENCIA') DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5rv6m306dgdn4cn14eyhpexwu` (`proveedor_id`);

--
-- Indexes for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqwu2j7ft8a7gg1t54pllqtqas` (`compra_id`),
  ADD KEY `FK8fysgqric0spig3y0hlkwe84e` (`producto_id`);

--
-- Indexes for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKsntaik0t9jxcky777753wytsx` (`id_producto`),
  ADD KEY `FKoknpg31rxsqnjxrsu7iy47p1o` (`id_venta`);

--
-- Indexes for table `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9nyueixdsgbycfhf7allg8su` (`id_categoria`),
  ADD KEY `FKpmfw7ds3rfuwge05ehb216r82` (`id_marca`),
  ADD KEY `FKkinjnx6sxv6kf9s6i21ttfnfo` (`id_proveedor`);

--
-- Indexes for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK51x42ydb5dsn6c0jg8iujipd4` (`cuit`);

--
-- Indexes for table `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `marca`
--
ALTER TABLE `marca`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `venta`
--
ALTER TABLE `venta`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `FK5rv6m306dgdn4cn14eyhpexwu` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`);

--
-- Constraints for table `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `FK8fysgqric0spig3y0hlkwe84e` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `FKqwu2j7ft8a7gg1t54pllqtqas` FOREIGN KEY (`compra_id`) REFERENCES `compra` (`id`);

--
-- Constraints for table `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `FKoknpg31rxsqnjxrsu7iy47p1o` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id`),
  ADD CONSTRAINT `FKsntaik0t9jxcky777753wytsx` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`);

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FK9nyueixdsgbycfhf7allg8su` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `FKkinjnx6sxv6kf9s6i21ttfnfo` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id`),
  ADD CONSTRAINT `FKpmfw7ds3rfuwge05ehb216r82` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
