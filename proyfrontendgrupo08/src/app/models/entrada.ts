import { Evento } from "./evento";
import { Usuario } from "./usuario";

export class Entrada {
      _id?: string;
      nombre?: string;
      precio?: number;
      tipo?: string;
      Qr?: string;
      estado?: boolean;
      usuarioId?: string | Usuario;
      eventoId?: string | Evento;
}
