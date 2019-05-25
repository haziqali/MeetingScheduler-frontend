import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours} from 'date-fns';
import { Subject, Subscription, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarEventTitleFormatter } from 'angular-calendar';
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

@Component({
  selector: 'app-calendar-admin',
  templateUrl: './calendar-admin.component.html',
  styleUrls: ['./calendar-admin.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class CalendarAdminComponent implements OnInit{

  ngOnInit() {
    this.getEventsData();
    this.verifyUserConfirmation();
  
  }

  constructor(private modal: NgbModal, private socketService: SocketService, private calendarService: CalendarService, private route: ActivatedRoute, private toastr: ToastrService) {}

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('AddMeeting') AddMeeting: TemplateRef<any>;
  @ViewChild('editMeeting') editMeeting: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  newEvent : any = {};

  CalendarView = CalendarView;

  viewDate: Date = new Date();


  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {
        this.socketService.setUser(Cookie.get("authtoken"));
      });
    }

  

  getEventsData() {
    const userName = this.route.snapshot.params['userName'];
    this.calendarService.getUser(userName)
    .subscribe((apiResponse) => {
      console.log(apiResponse)
      Cookie.set('userName', userName);
      if(apiResponse.data!==null) {
        let data = apiResponse.data.events
        this.events = data.map(obj =>{ 
          obj.end = new Date(obj.end)
          obj.start = new Date(obj.start)
          obj.actions = this.actions 
          obj.color = colors.yellow
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
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
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

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.saveEvent(event);
    this.getEventsData();
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action, event)
    if (action==="Edited") {
      this.modalData = event;
      this.modal.open(this.editMeeting, { size: 'lg' });

    }
    else if (action==="Deleted") {
      this.deleteEvent(event);
    }
    else if (action==='Dropped or resized') {
        return;
    }
    else{
      this.modalData = event;
      this.modal.open(this.modalContent, { size: 'lg' });
    }
   
  }

  openMeetingModal() {
    this.modal.open(this.AddMeeting, { size: 'lg' });
  }

  addEvent(): void {
    if(this.newEvent.title ==='' || this.newEvent.start==='' || this.newEvent.end==='' || this.newEvent.description==='') {
      this.toastr.error("Please enter all fields");
    }
    else {
    let data = {
      title: this.newEvent.title,
      start: this.newEvent.start,
      end: this.newEvent.end,
      description: this.newEvent.description,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }
    this.calendarService.addEvent(data)
    .subscribe((apiResponse) => {
      this.toastr.success(apiResponse.message)
      this.clearNewEvent();
      this.getEventsData();
      this.socketService.addEvent(data);
      this.calendarService.meetingAddedMail(data)
      .subscribe((apiResponse) => {
        this.toastr.success(apiResponse.message);
      })
    }, (err) => {
      this.toastr.error("Failed to add event")
  });
  }
  }
  clearNewEvent() {
    this.newEvent = {};
    this.modal.dismissAll(this.AddMeeting);
  }
  saveEvent(event): void {
    if(event.title ==='' || event.start==='' || event.end==='' || event.description==='') {
      this.toastr.error("Please enter all fields");
    }
    else{
    this.calendarService.updateEvent(event)
      .subscribe((apiResponse) => {
        this.toastr.success(apiResponse.message)
        this.socketService.updateEvent(event);
        this.calendarService.meetingUpdatedMail(event)
      .subscribe((apiResponse) => {
        this.toastr.success(apiResponse.message);
      })
      }, (err) => {
        this.toastr.error("Failed to add event")
    });
  }
}

  deleteEvent(eventToDelete: CalendarEvent) {
    this.calendarService.deleteEvent(eventToDelete)
      .subscribe((apiResponse) => {
        this.getEventsData();
        this.toastr.success(apiResponse.message);
        this.socketService.deleteEvent(eventToDelete);
      }, (err) => {
        this.toastr.error("Failed to delete event")
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}

