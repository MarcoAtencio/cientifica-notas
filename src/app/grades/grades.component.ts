import { Component, OnInit } from '@angular/core';
import { GradesService } from './grades.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  grades: any;
  gradeShow: any;

  constructor(private gradesService: GradesService, private router: Router) {}

  ngOnInit(): void {
    this.gradesService.getGrades().subscribe(
      (res) => {
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
          };
        });

        console.log('grades', this.grades);
        this.grades[0].select = true;
        this.gradeShow = this.grades[0].UCS_CONNOTA_CO;
        // console.log(this.grades);
      },
      (err) => {
        console.log(err);
        this.router.navigate(['/']);
      }
    );
  }

  getFinalGrade() {
    const grade = this.gradeShow;
    const sum = grade
      .filter((grade: any) => {
        return grade.detalle_evaluacion !== 'NOTA FINAL';
      })
      .map((grade: any) => {
        return (grade.peso / 100) * grade.nota;
      })
      .reduce((a: any, b: any) => a + b, 0);

    return sum;
  }

  selectCourse(course: any) {
    this.grades = this.grades.map((grade: any) => {
      return {
        ...grade,
        select: false,
      };
    });
    this.grades = this.grades.map((grade: any) => {
      if (grade.codigoCurso == course) {
        return {
          ...grade,
          select: true,
        };
      }
      return grade;
    });
    this.gradeShow = this.grades.find((grade: any, index: any) => {
      return grade.codigoCurso === course;
    }).UCS_CONNOTA_CO;
  }

  onChangeValue(event: Event, auxGrade: any): void {
    const value: string = (<HTMLInputElement>event.target).value;
    console.log('grade', { auxGrade, value });
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
    return 0;
  }
}
