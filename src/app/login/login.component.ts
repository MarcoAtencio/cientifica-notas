import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    this.loginService
      .login(this.email, this.password)
      .pipe(
        switchMap((res) => {
          console.log('first', res.UcsMetodoLoginRespuesta);
          if (res.UcsMetodoLoginRespuesta.valor !== 'N') {
            return this.loginService.token(this.email, this.password);
          }
          return [];
        })
      )
      .subscribe((res) => {
        sessionStorage.setItem('token', res.access_token);
        this.router.navigate(['/home']);
      });
  }
}
