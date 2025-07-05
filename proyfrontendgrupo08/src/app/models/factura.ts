import { Usuario } from "./usuario";

export class Factura {
    _id!: string;
    total!: number;
    fecha!: Date;
    detalles?: string;
    estado?: boolean;
    metodoPago?: string;
    transaccionId?: string;
    usuarioId?: string | Usuario;
}