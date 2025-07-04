export class Usuario {
    _id!: string;
    nombre!: string;
    apellido!: string;
    email!: string;
    rol!: 'usuario' | 'organizador' | 'administrador';
    estado?: boolean;
    telefono?: string;
    contraseña?: string;
    googleId?: string;
}
