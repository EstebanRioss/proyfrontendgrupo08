import { Evento } from "./evento";
import { Usuario } from "./usuario";
import { Factura } from "./factura";

export class Entrada {
      _id?: string;
      nombre?: string;
      precio?: number;
      tipo?: string;
      Qr?: string;
      estado?: string;
      usuarioId?: string | Usuario;
      eventoId?: string | Evento;
      facturaId?: string | Factura;
}
