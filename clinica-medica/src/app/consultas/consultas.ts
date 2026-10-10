import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Consulta } from '../models/consulta';
import { ClinicaService } from '../clinica-service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.scss'
})
export class ConsultasComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clinicaService = inject(ClinicaService);

  readonly consultas = this.clinicaService.consultas;
  readonly total = this.clinicaService.total;
  readonly carregado = this.clinicaService.carregado;

  readonly enviando = signal(false);

  readonly quantidadeConsultas = computed(
    () => this.consultas().length
  );

  formulario = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    data: ['', Validators.required]
  });

  cadastrarConsulta(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const dados = this.formulario.getRawValue();
    const consulta = new Consulta(
      dados.nome!.trim(),
      Number(dados.preco),
      dados.data!
    );
    this.clinicaService.adicionarConsulta(consulta);
    this.formulario.reset({
      nome: '',
      preco: 0,
      data: ''
    });
  }
}
