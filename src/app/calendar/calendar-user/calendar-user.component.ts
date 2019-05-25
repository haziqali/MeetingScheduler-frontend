import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy} from '@angular/core';
import { subMonths, addMonths, addWeeks, subWeeks, startOfMonth, startOfWeek,
endOfWeek, startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject, Subscription, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEventTitleFormatter, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarService } from '../calendar.service';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { CustomEventTitleFormatter } from '../custom-event-title-formatter';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}

@Component({
  selector: 'app-calendar-user',
 
  templateUrl: './calendar-user.component.html',
  styleUrls: ['./calendar-user.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class CalendarUserComponent implements OnInit {

  ngOnInit() {
    this.getEventsData();
    this.verifyUserConfirmation();
    this.eventAdded();
    this.eventUpdated();
    this.eventDeleted();
    this.subscription = interval(5000).subscribe(val => this.checkMeeting());
  }

  constructor(private modal: NgbModal, private socketService: SocketService, private calendarService: CalendarService, private route: ActivatedRoute, private toastr: ToastrService) {
    this.dateOrViewChanged();
  }

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('meetingInvite') meetingInvite: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  minDate: Date = subMonths(new Date(), new Date().getMonth() );

  maxDate: Date = addMonths(new Date(), 11 - new Date().getMonth() );

  prevBtnDisabled: boolean = false;

  nextBtnDisabled: boolean = false;

  subscription: Subscription;

  CalendarView = CalendarView;


  viewDate: Date = new Date();

  public checkMeeting: any =() => {
    if(Cookie.get("userName") === Cookie.get("receiverUserName")) {
    let today = new Date();
    let temp = this.events.map(x => (x.start.getTime() - today.getTime())/60000);
    let diffMs = temp.some(el => el>=0 && el <=30) 
    if(diffMs) {
      this.modal.dismissAll(this.meetingInvite);
      this.modal.open(this.meetingInvite, { size: 'lg' });
    };
  }
   
  }

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {
        this.socketService.setUser(Cookie.get("authtoken"));
      });
    }

    public eventAdded: any = () =>  {
      this.socketService.eventAdded()
      .subscribe((message) => {
        this.toastr.success(message);
      })
    }

    public eventUpdated: any = () =>  {
      this.socketService.eventUpdated()
      .subscribe((message) => {
        this.toastr.success(message);
      })
    }

    public eventDeleted: any = () =>  {
      this.socketService.eventDeleted()
      .subscribe((message) => {
        this.toastr.success(message);
      })
    }
  

  
    destroySub() {
      this.subscription.unsubscribe();
    }

  getEventsData() {
    const userName = this.route.snapshot.params['userName'];
    this.calendarService.getUser(userName)
    .subscribe((apiResponse) => {
      Cookie.set('userName', userName);
      if(apiResponse.data!==null) {
        console.log()
        let data = apiResponse.data.events
        this.events = data.map(obj => { 
          obj.end = new Date(obj.end);
          obj.start = new Date(obj.start);
          obj.draggable = false;
          obj.resizable.afterEnd = false;
          obj.resizable.beforeStart = false;
          return obj;
       });
      } 
      }, (err) => {
        console.error('some error occured')
    });

  }

  modalData: any;

  actions: CalendarEventAction[] = [
    {
      label: 'click',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Clicked', event);
      }
    },
   
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }



  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = event ;
    this.modal.open(this.modalContent, { size: 'lg' });
  }





 

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  increment(): void {
    this.changeDate(addPeriod(this.view, this.viewDate, 1));
  }

  decrement(): void {
    this.changeDate(subPeriod(this.view, this.viewDate, 1));
  }

  today(): void {
    this.changeDate(new Date());
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarPeriod): void {
  
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    this.prevBtnDisabled = !this.dateIsValid(
      endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
    );
    this.nextBtnDisabled = !this.dateIsValid(
      startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
    );
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }
}


