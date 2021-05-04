import { Component, OnInit } from '@angular/core';
import { Statistics } from "statistics.js";
import { Turma } from '../../../../common/turma';
import { RelatoriosService } from './relatorios.service';
import { Roteiro } from '../../../../common/roteiro';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
  providers: [RelatoriosService]
})
export class RelatoriosComponent implements OnInit {

  turma: Turma;
  roteiros: Roteiro[];
  roteiro: Roteiro;
  media: Number;
  desvio: Number;
  corr: Number;
  questoesCertas: number;
  questoesErradas: String;
  descricao: String;
  buscaTurma: String;
  searchArr: Turma[];

  constructor(private service: RelatoriosService) {
  }

  ngOnInit() {
    this.searchArr = [];
    this.questoesCertas = 80.05; //nota simulada
    this.questoesErradas = (100 - this.questoesCertas).toFixed(2);
    // this.descricao = '2020.1';

  }

  searchChange(): void {
    // @ts-ignore
    this.turma = this.service.getTurma(this.buscaTurma)
      .subscribe(
        (as) => {
          this.turma = as;
          if (as) {
            this.searchArr.push(as);
          }
          this.questoesCertas = this.questoesCertas;
          this.questoesErradas = this.questoesErradas;
          this.descricao = this.descricao;
          console.log(this.searchArr);
        }
      );
  }

  getMedia(turma: Turma): Number {
    let matriculas = turma.matriculas;
    let qtdMatriculas = matriculas.length
    let somaDuracao = 0
    let medias = []
    let count = 0
    let total = 0;

    matriculas.forEach(matricula => {
      somaDuracao = 0;
      count = 0;
      matricula.respostasDeRoteiros['respostasDeQuestoes'].forEach(questao => {
        somaDuracao += questao.duracao;
        count += 1;
      });
      medias.push(somaDuracao / count);
    });

    for (var i = 0; i < medias.length; i++) {
      total += medias[i];
    }
    var media = total / medias.length;

    return media
  }

  getDesvio(turma: Turma): Number {
    let matriculas = this.turma.matriculas;
    let qtdMatriculas = matriculas.length;
    let media = this.getMedia(turma);
    let desvio = 0;
    let count = 0

    matriculas.forEach(matricula => {
      matricula.respostasDeRoteiros['respostasDeQuestoes'].forEach(questao => {
        // @ts-ignore
        desvio += Math.abs(questao.duracao - media);
        count += 1;
      })

    })

    return desvio / count

  }

  getCorr(turma): Number {
    let matriculas = this.turma.matriculas;
    let measurements = [];

    let vars = {
      duracao: 'metric',
      correcao: 'metric'
    };

    matriculas.forEach(matricula => {
      matricula.respostasDeRoteiros['respostasDeQuestoes'].forEach(questao => {
        if (questao.correcao == 'Errado') {
          measurements.push({ duracao: questao.duracao, correcao: 0 });
        }
        else if (questao.correcao == 'Certo') {
          measurements.push({ duracao: questao.duracao, correcao: 1 });
        }
      })
      console.log(measurements);

    })

    let stats = new Statistics(measurements, vars);
    var r = stats.correlationCoefficient('duracao', 'correcao');

    return r.correlationCoefficient.toFixed(2)
  }

}
