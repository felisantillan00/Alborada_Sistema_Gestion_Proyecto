export interface PresupuestoRequest {
    nombreCliente: string;
    estado: string;
    valorManoDeObra: number;
    observacion: string;
    detalles: {
        id: number;
        cantidad: number;
        valorVenta: number;
    }[];
}

export interface PresupuestoView {
    id: number;
    nombreCliente: string;
    estado: string;
    valorTotal: number;
    valorManoDeObra: number;
    fechaCreacion: string;
    fechaConfirmada: string | '';
    observacion: string;
    detalles: {
        id: number;
        nombreProducto: string;
        valorVenta: number;
        cantidad: number;
    }[];
}
