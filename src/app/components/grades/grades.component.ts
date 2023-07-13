import { Component, OnInit } from '@angular/core';
import { GradesService } from './grades.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  grades: any;
  gradeShow: any;
  idGradeShow: string = '';
  coursesLastCycle: any = [];
  totalCredits: number = 0;
  average: string = '00';
  finalAverageText: string = '00';

  constructor(private gradesService: GradesService, private router: Router) {}

  ngOnInit(): void {
    this.gradesService
      .getCourseHistory()
      .pipe(
        switchMap((res) => {
          this.coursesLastCycle =
            res.UCS_REST_HST_CRSE_RES.UCS_REST_HST_CRSE_COM.filter(
              (course: any) =>
                course.Des_ciclo_lectivo === 'Semest Pregrad Regular 2023-1'
            );
          return this.gradesService.getGrades();
        })
      )
      .subscribe({
        next: (res) => {
          this.grades = res.UCS_CONNOTA_RES.UCS_CONNOTA_COM;
          //update the final grade of the course with the sum of the grades
          this.grades = this.grades.map((grade: any) => {
            return {
              ...grade,
              notaFinal: grade.UCS_CONNOTA_CO.filter((grade: any) => {
                return grade.detalle_evaluacion !== 'NOTA FINAL';
              })
                .map((grade: any) => {
                  return (grade.peso / 100) * grade.nota;
                })
                .reduce((a: any, b: any) => a + b, 0),
              creditos: this.coursesLastCycle.find((course: any) => {
                return course.Curso === grade.codigoCurso;
              }).Creditos,
            };
          });
          this.totalCredits = this.grades.reduce((a: any, b: any) => {
            return a + parseInt(b.creditos);
          }, 0);
          this.grades[0].select = true;

          this.gradeShow = this.grades[0].UCS_CONNOTA_CO;
          this.idGradeShow = this.grades[0].codigoCurso;
        },
        complete: () => {
          this.finalAverage();
        },
        error: (err) => {
          this.router.navigate(['/']);
        },
      });
  }

  getFinalGrade() {
    const sum = this.gradeShow
      .filter((grade: any) => {
        return grade.detalle_evaluacion !== 'NOTA FINAL';
      })
      .map((grade: any) => {
        return (grade.peso / 100) * grade.nota;
      })
      .reduce((a: any, b: any) => a + b, 0);

    this.grades = this.grades.map((grade: any) => {
      if (grade.codigoCurso === this.idGradeShow) {
        return {
          ...grade,
          notaFinal: sum,
        };
      }
      return grade;
    });

    return sum;
  }

  selectCourse(course: any) {
    this.grades = this.grades.map((grade: any) => {
      if (grade.codigoCurso == course) {
        return {
          ...grade,
          select: true,
        };
      }
      return {
        ...grade,
        select: false,
      };
    });

    this.gradeShow = this.grades.find((grade: any, index: any) => {
      if (grade.codigoCurso === course) {
        this.idGradeShow = grade.codigoCurso;
        return true;
      }
      return false;
    }).UCS_CONNOTA_CO;
  }

  onChangeValue(event: Event, auxGrade: any): void {
    const value: string = (<HTMLInputElement>event.target).value;

    this.gradeShow = this.gradeShow.map((grade: any) => {
      if (grade.detalle_evaluacion === auxGrade.detalle_evaluacion) {
        grade.nota = value;
      }
      return grade;
    });
  }

  back() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  finalAverage() {
    const sumGrades = this.grades
      .reduce(
        (acumulator: any, currentValue: any) =>
          acumulator + currentValue.notaFinal.toFixed() * currentValue.creditos,
        0
      )
      .toFixed(2);

    const average = (sumGrades / this.totalCredits).toFixed(2);

    this.finalAverageText = average;
  }
}
