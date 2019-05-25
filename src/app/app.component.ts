import { Component, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserService } from './user/user.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit {

 
  title = 'app';
  public showHead: any;
  public adminCheck = false;

  constructor(
    
    public router: Router,
    private userService: UserService,
    )  {
      // on route change to '/login', set the variable showHead to false
      if (Cookie.get("receiverUserName") === "w-admin") {
          this.adminCheck = true;
      }
        router.events.forEach((event) => {
          if (event instanceof NavigationStart) {
            if (event['url'] === '/sign-up' || event['url'] ==="/login" || event['url'] ==="/logout"|| event['url'] ==="/" || event['url']==="/forgotpassword") {
              this.showHead = false;
            } else {
              this.showHead = true;
            }
            
          }
        });
      }

  ngOnInit(): void {
  }
  

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);
  }
}
