import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private userService: UserService, private toastr: ToastrService, private socketService: SocketService) { }

  ngOnInit() {
    localStorage.clear();
    this.userService.logout()
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) { 
          Cookie.deleteAll();
          this.socketService.exitSocket()
        
      

      } else {
        this.toastr.error(apiResponse.message)
      
      }

    }, (err) => {
      this.toastr.error('some error occured')

    });
  }

}
