import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  private API = 'https://back-miportal.cientifica.edu.pe/';

  login(email: string, password: string): Observable<any> {
    const endpoint = `${this.API}student/login`;
    return this.http.post<any>(endpoint, {
      email,
      password,
      origen: 'W',
    });
  }

  token(email: string, password: string): Observable<any> {
    const endpoint = `${this.API}oauth/token`;
    return this.http.post<any>(endpoint, {
      username: email,
      password,
      client_id: 2,
      client_secret: 'UuSTMkuy1arAjaIA4yY5l5xXRm6NonaKZoBk2V1a',
      grant_type: 'password',
    });
  }
}
