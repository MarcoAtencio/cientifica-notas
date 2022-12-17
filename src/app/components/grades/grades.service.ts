import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  private API = 'https://back-miportal.cientifica.edu.pe/';

  constructor(private http: HttpClient) {}

  getGrades() {
    const endpoint = `${this.API}student/grades`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      endpoint,
      {
        institution: 'PREGR',
        degree: 'UGRD',
        strm: '2231',
        emplid: '-',
      },
      {
        headers,
      }
    );
  }

  getCourseHistory() {
    const endpoint = `${this.API}student/getCourseHistory`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      endpoint,
      { institution: 'PREGR', career: 'UGRD', emplid: null },
      {
        headers,
      }
    );
  }
}
