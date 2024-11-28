import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = ['http://localhost:8080']

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginRequest: any): Observable<any>{
    console.log(loginRequest)
    return this.http.post(BASE_URL + "/api/auth/login", loginRequest)
  }

  register(registerRequest: any): Observable<any>{
    return this.http.post(BASE_URL + "/api/auth/register", registerRequest)
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all');
  }
}
