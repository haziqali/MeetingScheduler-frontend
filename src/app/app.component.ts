import { Component, OnInit, ChangeDetectionStrategy, OnDestroy  } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserService } from './user/user.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from './socket.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent implements OnInit, OnDestroy {

 
  title = 'app';
  public showHead: any;
  public adminCheck = false;

  constructor(
    
    public router: Router,
    private userService: UserService,
    private socketService: SocketService,
    private toastr: ToastrService
    )  {
      // on route change to '/login', set the variable showHead to false
      
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
    if (Cookie.get("role")==="admin") {
      
        this.adminCheck = true;
        console.log(this.adminCheck);
    }
  }

  ngOnDestroy(): void {
    localStorage.clear();
    this.userService.logout()
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) { 
          Cookie.deleteAll();
          this.socketService.exitSocket();
        
      

      } else {
        this.toastr.error(apiResponse.message)
      
      }

    }, (err) => {
      this.toastr.error('some error occured')

    });
  }



  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);
  }
}
