import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import {Subject} from 'rxjs';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    // return this.token;
    return localStorage.getItem('token');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData).subscribe(response => {
      const token = response.token;
      localStorage.setItem('token', token);
      if (token) {
        const expiresInDuration =  response.expiresIn;
        console.log(expiresInDuration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresInDuration * 1000);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
      // this.token = token;
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
