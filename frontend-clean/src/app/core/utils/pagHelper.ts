import { Pagina } from '../models/pagina';


export class PagHelper {
    public cantidadActual: number = 100
    public readonly LIMITE: number = 1000

    public totalElements: number = 0;
    public totalPages: number = 0;
    public currentPage: number = 0;

    constructor(private fetchCallback: () => void) { }

    // Genera automáticamente los parámetros para Spring Boot
    public getParams(): { page: number; size: number } {
        return { page: 0, size: this.cantidadActual };
    }

    // Lógica centralizada del botón "Ver más"
    public cargarMas(): void {
        if (this.cantidadActual >= this.LIMITE) {
            alert(`Has alcanzado el límite de ${this.LIMITE} de items. No se pueden cargar más.`);
            return;
        }
        this.cantidadActual = Math.min(this.cantidadActual + 100, this.LIMITE);
        this.fetchCallback(); // Ejecuta la búsqueda
    }

    // Método para guardar los datos que devuelve el backend
    public setMetadata<T>(pagina: Pagina<T>): void {
        this.totalElements = pagina.totalElements;
        this.totalPages = pagina.totalPages;
        this.currentPage = pagina.number;
    }

}