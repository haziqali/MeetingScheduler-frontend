import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarAdminComponent } from './calendar-admin/calendar-admin.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '../guards/auth.guard';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { UserListComponent } from './user-list/user-list.component';
import { CalendarUserComponent } from './calendar-user/calendar-user.component';

@NgModule({
  declarations: [CalendarAdminComponent, UserListComponent, CalendarUserComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([ 
      { path: 'all-users', component: UserListComponent, canActivate: [AuthGuard],data: { roles: ['admin'] } },
      { path: ':userName/calendar-admin', component: CalendarAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: ':userName/calendar-user', component: CalendarUserComponent, canActivate: [AuthGuard] }
    ]),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class CalendarViewModule { }
