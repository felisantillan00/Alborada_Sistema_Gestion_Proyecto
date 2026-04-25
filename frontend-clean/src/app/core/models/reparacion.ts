export interface ReparacionRequest {
    nombreCliente: string;
    estado: string;
    valorManoDeObra: number;
    fechaConfirmada?: string;
    observacion?: string;
    detalles: {
        idProducto: number;
        cantidad: number;
        valorVenta: number;
    }[];
}
export interface ReparacionView {
    id: number;
    nombreCliente: string;
    estado: string;
    valorTotal: number;
    valorManoDeObra: number;
    fechaConfirmada?: string;
    observacion?: string;
    detalles: {
        id: number;
        nombreProducto: string;
        valorVenta: number;
        cantidad: number;
    }[];
}