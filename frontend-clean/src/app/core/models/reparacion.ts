export interface ReparacionRequest {
    estadoReparacion: string;
    valorTotal: number;
    valorManoDeObra: number;
    fechaConfirmada?: string;
    detalle: {
        idProducto: number;
        cantidad: number;
        valorVenta: number;
    }[];
}
export interface ReparacionView {
    id: number;
    estadoReparacion: string;
    valorTotal: number;
    valorManoDeObra: number;
    fechaConfirmada?: string;
    detalle: {
        id: number;
        nombreProducto: string;
        valorVenta: number;
        cantidad: number;
    }[];
}