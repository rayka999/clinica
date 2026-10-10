import { Injectable, signal, computed } from '@angular/core';
import { Consulta } from './models/consulta';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  private readonly chave = 'consultas-clinica';

  private readonly consultasSignal = signal<Consulta[]>([]);
  readonly consultas = this.consultasSignal.asReadonly();

  readonly carregado = signal(false);

  readonly total = computed(() =>
    this.consultasSignal().reduce(
      (soma, consulta) => soma + Number(consulta.preco || 0),
      0
    )
  );

  constructor() {
    this.carregarConsultas();
  }

   carregarConsultas(): void {
    const dados = sessionStorage.getItem(this.chave);
    if (dados) {
      try {
        const lista = JSON.parse(dados);
        if (lista && Array.isArray(lista)) {
          this.consultasSignal.set(
            lista.map(item =>
              new Consulta(
                item.nome ?? '',
                Number(item.preco ?? 0),
                item.data ?? ''
              )
            )
          );
          if (lista.length > 0) {
            this.carregado.set(true);
            return;
          }
        }
      } catch (erro) {
        console.error('Erro ao carregar consultas:', erro);
      }
    }
    this.consultasSignal.set([
      new Consulta('Ana Silva', 150, '2026-10-01'),
      new Consulta('Bruno Souza', 200, '2026-10-02'),
      new Consulta('Carla Oliveira', 180, '2026-10-05'),
      new Consulta('Daniel Santos', 250, '2026-10-06')
    ]);
    this.salvarConsultas();
    this.carregado.set(true);
  }

  salvarConsultas(): void {
    sessionStorage.setItem(
      this.chave,
      JSON.stringify(this.consultasSignal())
    );
  }

  adicionarConsulta(consulta: Consulta): void {
    this.consultasSignal.update(lista => [...lista, consulta]);
    this.salvarConsultas();
  }
}
