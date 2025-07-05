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
    confirmado?: boolean;
    estadoAprobacion?: 'pendiente' | 'aprobado' | 'rechazado';
    nombreEmpresa?: string;
    cuit?: string;
    descripcion?: string;
    tokenConfirmacion?: string | null;
}