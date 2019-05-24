import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  

  private url =  'http://localhost:3000/api/v1/';

  constructor( public http: HttpClient) { }

  public getUser(data): Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
    .set('userName', data)
  return this.http.post(`${this.url}users/userDetails`, params);
  }

  public addEvent(data): Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
    .set('userName', Cookie.get('userName'))
    .set('title', data.title)
    .set('start', data.start.toJSON())
    .set('end', data.end.toJSON())
    .set('description', data.description)
    .set('createdBy', Cookie.get("receiverUserName"))
    .set('draggable', data.draggable)
    .set('resizablebeforeStart', data.resizable.beforeStart)
    .set('resizableafterEnd', data.resizable.afterEnd)
  return this.http.post(`${this.url}events/addEvent`, params);
  }

  public updateEvent(data): Observable<any> {

    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
    .set('userName', Cookie.get('userName'))
    .set('title', data.title)
    .set('start', data.start.toJSON())
    .set('end', data.end.toJSON())
    .set('description', data.description)
    .set('id', data._id)
    console.log(data._id)
  return this.http.post(`${this.url}events/updateEvent`, params);
  }

  public deleteEvent(data): Observable<any> {
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
    .set('userName', Cookie.get('userName'))
    .set('id', data._id)
    
  return this.http.post(`${this.url}events/deleteEvent`, params);
  }


  public meetingAddedMail(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
      .set('userName', Cookie.get("userName"))
      .set("title", data.title)
      .set("admin", Cookie.get("receiverUserName"));
    return this.http.post(`${this.url}events/meetingAddedMail`, params);
  }


  public meetingUpdatedMail(data): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
      .set('userName', Cookie.get("userName"))
      .set("title", data.title)
      .set("admin", Cookie.get("receiverUserName"));
    return this.http.post(`${this.url}events/meetingUpdatedMail`, params);
  }
}
