export class Consulta {
  nome: string;
  preco: number = 0;
  data: string;

  constructor(nome: string = '', preco: number = 0, data: string = '') {
    this.nome = nome;
    this.preco = preco;
    this.data = data;
  }
}
