export interface AuthResponse {
    ok: boolean;
    uid?: string;
    name?: string;
    lastName?: string;
    token?: string;
    msg?: string;
    role?:string;
    phoneNumber?: number;
    password?: string;
}

export interface Trabajador{
    uid?: string;
    _id?: string;
    name?: string;
    lastName?: string;
    role?:string;
    phoneNumber?: number;
    user?: string;
    password?: string;
}
export interface Usuario{
    ok?: boolean;
    uid?: string;
    _id?: string;
    name?: string;
    lastName?: string;
    phoneNumber?: number;
    signedUp?: string;
    dateStart?: Date;
    dateEnd?: Date;
}
export interface Producto{
    ok?: boolean;
    _id?: string;
    nombre?: string;
    presentacion?:string;
    tipo?:string;
    cantidad?: number;
    precio?: number;
    fecha?: Date;
}

export interface Venta{
    ok?: boolean;
    _id?: string;
    nombre?: string;
    cantidad?: number;
    precio?: number;
    ganancia: number;
    concepto?: string;
    fecha:Date;
    id_INS?: number;
    id_DE?: string;
}
export interface Deuda{
    ok?: boolean;
    _id?: string;
    producto?: string;
    cantidad?: number;
    precio?: number;
    perdida: number;
    concepto?: string;
    fecha:Date;
    deudor: string;
}

export interface Corte{
    ok?: boolean;
    _id: string;
    fecha: Date;
    corte: number;
    estatus: boolean;
}
export interface Caja{
    ok?: boolean;
    _id: string;
    cantidad?: number;
    usuario?: string;
    fecha?: Date;
}
export interface getTrabajadores{
    ok?: boolean;
    _id?: string;
    venta?:object;
    corte:number;
    date:Date;
}