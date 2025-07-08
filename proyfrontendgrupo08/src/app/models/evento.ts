import { CategoriaEvento } from "./categoria-evento";
import { Usuario } from "./usuario";

export class Evento {
    _id?: string;
  nombre?: string;
  descripcion?: string;
  fecha?: Date;
  ubicacionNombre?: string;
  latitud?: string;
  longitud?: string;
  capacidadTotal?: number;
  stock?: number;
  imagenUrl?: string;
  estado?: boolean;
  categoriaId?: string | CategoriaEvento;
  organizadorId?: string | Usuario;
  dia?: string;
  mes?: string;
  diaSemana?: string;
  entradas: {
    tipo: string;
    precio: number;
    cantidad: number;
  }[] = [];
}
