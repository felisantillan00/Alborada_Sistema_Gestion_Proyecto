export interface Pagina<T>{
    contenido: T[];
    totalElementos: number;
    totalPaginas: number;
    nroPagina: number;
    cantidadElementos: number;
    primero: boolean;
    ultimo: boolean;
    vacio: boolean;

}