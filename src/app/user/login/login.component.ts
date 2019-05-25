import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { UserService } from './../user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  public email: any;
  public password: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,  
  ) {

  }

  ngOnInit() {
  }

  // end goToSignUp

  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {
      let data = {
        email: this.email,
        password: this.password
      }

      this.userService.signinFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
             Cookie.set('authtoken', apiResponse.data.authToken);   
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
             Cookie.set('receiverUserName', apiResponse.data.userDetails.userName);
             Cookie.set('role', apiResponse.data.userDetails.role);
             this.userService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
             if(apiResponse.data.userDetails.role==="admin") {
              this.router.navigate(['/all-users']);
             }
             else{
              this.router.navigate([`/${apiResponse.data.userDetails.userName}/calendar-user`]);
             }
            
          } else {
            this.toastr.error(apiResponse.message)    
          }
        }, (err) => {
          this.toastr.error('some error occured')
        });
    } // end condition
  } // end signinFunction
}