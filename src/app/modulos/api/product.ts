export interface Product {
    id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    categorias: string[];
    veces_vendido: number;
    imagen?: string;
    imagenes_secundarias?: string[];
    imagen_recortada?: string;
    imagenes_secundarias_recortadas?: string[];
    tienda?: string;
    stock_cantidad?: number;
    sku?: string;
}
