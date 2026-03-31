export interface VentaRequest {
  nombreCliente: string;
  total: number;
  formaPago: string;
  observacion?: string;
  detalles: {
    idProducto: number;
    cantidad: number;
  }[];
}

export interface VentaDetalle {
  id: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaView {
  id: number;
  total: number;
  formaPago: string;
  observacion?: string;
  nombreCliente: string;
  fechaVenta: string;
  detalles: VentaDetalle[];
}