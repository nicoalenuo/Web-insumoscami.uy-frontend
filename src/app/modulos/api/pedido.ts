import { Product } from './product';
import { ProductMercadoPago } from './product_mercadopago';

export interface Pedido {
    id: number;
    estado: string;
    user_mail: string;
    fechaCreacion: string;
    es_online: boolean;
    pago_correcto_mercadopago: boolean;
    items: ProductMercadoPago[];
}
