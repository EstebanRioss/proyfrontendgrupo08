import { Evento } from "./evento";
import { Usuario } from "./usuario";

export class Entrada {
      _id?: string;
      nombre?: string;
      precio?: number;
      tipo?: string;
      qr?: string;
      estado?: string;
      usuarioId?: string | Usuario;
      eventoId?: string | Evento;
}
