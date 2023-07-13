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
  token: string = '';

  usuariosCollection: CollectionReference<any>;

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');
  }

  ngOnInit(): void {}

  login() {

    if (this.token) {
      console.log('Usuario logueado',this.token);
      sessionStorage.setItem('token', this.token);
      this.router.navigate(['/home']);
    }
  }
}
