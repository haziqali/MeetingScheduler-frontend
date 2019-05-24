import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as countryJson from 'src/assets/country.json';
import * as phoneJson from 'src/assets/phone.json';
import { UserService } from '../user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public username: any;
  public mobile: any;
  public email: any;
  public password: any;
  public countries: any;
  public phones: any
  public countrySelectedCode: any
  public countrySelected: any
  public role: any = "user";

  constructor(  
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
   ) {
     }

  ngOnInit() {
  
    this.countries = countryJson["default"];
    let mapped = Object.keys(this.countries).map(key => ({code: key, country: this.countries[key]}));
    this.countries = mapped;
    this.phones = phoneJson["default"];
    let mapped1 = Object.keys( this.phones).map(key => ({code: key, phone:  this.phones[key]}));
    this.phones = mapped1;
    this.countries.sort(function(a, b){
      if (a.country < b.country) //sort string ascending
        return -1 
    if (a.code > b.code)
        return 1
  });
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  onChange(countryCode) { 
    let found = this.phones.find(element => element.code === countryCode);
    this.countrySelectedCode = "+"+found.phone;
}

  public signupFunction: any = () => {
    if (!this.username) {
      this.toastr.warning('enter user name')

    } else if (!this.mobile) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')

    } else {
      if (this.role === "admin") {
        this.username = this.username + "-admin";
      }
      let data = {
       username: this.username,
        mobile: this.countrySelectedCode + this.mobile ,
        email: this.email,
        password: this.password,
        role: this.role
      }

      this.userService.signupFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {

          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
