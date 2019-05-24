import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  public userList: any;

  constructor(private userService : UserService,
              private toastr: ToastrService   
             ) {}

  ngOnInit() {
    this.getList();
  }

  getList(): void {
    this.userService.getAllUsers()
    .subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.userList = apiResponse.data;
      } 
    }, (err) => {
      this.toastr.error('some error occured')
    });
  }
}
  

