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
    const endpoint = `${this.API}api/client/parameters/grades`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      endpoint,
      {
        institution: 'PREGR',
        degree: 'UGRD',
        strm: '2233',
        emplid: '-',
      },
      {
        headers,
      }
    );
  }

  getCourseHistory() {
    const endpoint = `${this.API}api/client/parameters/getCourseHistory`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      endpoint,
      { emplid: null, career: 'UGRD', institution: 'PREGR' },
      {
        headers,
      }
    );
  }
}
