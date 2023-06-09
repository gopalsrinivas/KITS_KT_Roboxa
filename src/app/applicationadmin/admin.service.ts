import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endPointsUser, country } from '../api';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
headers = new HttpHeaders({
  // 'Content-Type': 'application/json',
  // 'Access-Control-Allow-Origin': '*'

})
  constructor(private _httpClient: HttpClient) {
   
   }
  //  ,{headers:this.headers}
  // Services for cro
  getCro(): Observable<any> {
    return this._httpClient.get(endPointsUser.getcros);
  }
  getCrobyId(id: any): Observable<any> {
    return this._httpClient.get(endPointsUser.getCroById + id)
  }
  CreateCroDetails(data: string): Observable<any> {
    return this._httpClient.post(endPointsUser.getCroAddUpdate, data)
  }
  updateCroDetaild(data: []): Observable<any> {
    return this._httpClient.put(endPointsUser.getCroAddUpdate, data)
  }

  // Services for USer
  getUser(): Observable<any> {
    return this._httpClient.get(endPointsUser.getUser)
  }
  getUserbyId(id: any): Observable<any> {
    return this._httpClient.get(endPointsUser.getUserById + id)
  }
  createUser(data: string): Observable<any> {
    return this._httpClient.post(endPointsUser.getUserAddUpdate, data)
  }
  updateUser(data: []): Observable<any> {
    return this._httpClient.put(endPointsUser.getUserAddUpdate, data)
  }

  // Login Services
  login(data: any): Observable<any> {
    return this._httpClient.post(endPointsUser.login, data)
  }
  otp(data: any): Observable<any> {
    return this._httpClient.post(endPointsUser.sendotp, data)
  }

  //country
  country(){
    return this._httpClient.get(country)
  }
}
