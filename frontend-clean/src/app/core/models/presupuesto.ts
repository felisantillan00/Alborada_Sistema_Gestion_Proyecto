export interface PresupuestoRequest {
    nombreCliente: string;
    estado: string;
    valorManoDeObra: number;
    fechaCreacion: string;
    fechaConfirmada: string;
    observacion: string;
    detalles: {
        idProducto: number;
        cantidad: number;
        precioUnitario: number;
    }[];
}

export interface PresupuestoView {
    id: number;
    nombreCliente: string;
    estado: string;
    valorTotal: number;
    valorManoDeObra: number;
    fechaCreacion: string;
    fechaConfirmada: string;
    observacion: string;
    detalles: {
        id: number;
        nombreProducto: string;
        precioUnitario: number;
        cantidad: number;
    }[];
}