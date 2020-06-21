export class Diocesis {
    id?: string;
    nombre: string;
    departamento: string;
    registrosCount: number;
    transferencia: boolean;
    estado: boolean;
    createdAt: Date;


  constructor(diocesis: Diocesis) {
    this.nombre = diocesis.nombre;
    this.departamento = diocesis.departamento;
    this.registrosCount = diocesis.registrosCount;
    this.transferencia = diocesis.transferencia;
    this.estado = diocesis.estado;
    this.createdAt = diocesis.createdAt;
  }
}
