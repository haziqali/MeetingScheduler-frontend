import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, ObservableInput } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";



@Injectable()
export class UserService {
 

  private url =  'http://api.themeetingscheduler.tk';

  constructor(
    public http: HttpClient
  ) {}

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public removeUserInfoFromLocalstorage = () => {
    localStorage.removeItem('userInfo');
  } 

  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.username)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('role', data.role)
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/login`, params);
  }
 
  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('password', data.password)
      .set('confirmPassword', data.confirmPassword)
      .set('token', data.token);
    return this.http.post(`${this.url}/api/v1/users/resetpassword`, params);
  }

  public forgotPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email);
    return this.http.post(`${this.url}/api/v1/users/sendMail`, params);
  }

  public getSingleUser(email): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
      .set('email', email);
    return this.http.post(`${this.url}/api/v1/users/userDetails`, params);
  }

   
  public getAllUsers(): Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
  return this.http.post(`${this.url}/api/v1/users/view/all`, params);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

}
