import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user/user.service';

@Injectable()
export class SocketService {

  private url = 'http://api.themeetingscheduler.tk';

  private socket;

  constructor(public http: HttpClient, public userService: UserService) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);
    
  }
  
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end verifyUser


  public exitSocket = () =>{
    this.socket.disconnect();
    this.socket.emit("disconnect");
  }

  public setUser = (authToken) => {
    this.socket.emit("set-user", authToken);
  } // end setUser

  

  public addEvent = (data) => {
    this.socket.emit("add-event", data, Cookie.get("userName"));

  }
  
  public eventAdded = () => {
    return Observable.create((observer) => {
      this.socket.on(`event-added`, (message) => {
        observer.next(message);
      }); 
    }); // end Observable
  }

  public updateEvent = (data) => {
    this.socket.emit("update-event", data, Cookie.get("userName"));

  }
  
  public eventUpdated = () => {
    return Observable.create((observer) => {
      this.socket.on(`event-updated`, (message) => {
        console.log(213)
        observer.next(message);
      }); 
    }); // end Observable
  }

  public deleteEvent = (data) => {
    this.socket.emit("delete-event", data, Cookie.get("userName"));

  }
  
  public eventDeleted = () => {
    return Observable.create((observer) => {
      this.socket.on(`event-deleted`, (message) => {
        observer.next(message);
      }); 
    }); // end Observable
  }

 
}
