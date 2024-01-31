import { Component, Input } from '@angular/core';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { WebSocketService } from 'src/app/shared/services/socketio.service';

@Component({
  selector: 'app-report-update-cards',
  templateUrl: './report-update-cards.component.html',
  styleUrls: ['./report-update-cards.component.scss']
})
export class ReportUpdateCardsComponent {
  @Input() report: any = [];
  @Input() displayStyle: string = "";
  @Input() message: any = [];
  @Input() progressValue: any = 54;
  reportStatus: string = "";
  status: string = 'Processing...';
  statusSocket: string = '';
  userInfo: any = [];
  userId: string = '';
  constructor(
    private socketService: WebSocketService,
    private localStorage: LocalStorageService
  ) { }
  ngOnInit() {
    this.userInfo = this.localStorage.getUserInfo();
    this.userId = this.userInfo._id;
    this.statusSocket = this.userId + '_report_' + this.report.report_generation_id + '_status';
    this.status = this.localStorage.getitem(this.statusSocket) || 'Processing...';

    this.setupReportStepListener();
  }

  setupReportStepListener() {
    this.socketService.listen(this.statusSocket).subscribe({
      next: (res) => {
        // console.log("Response of socket", res);
        this.status = res.message;
        this.localStorage.setitem(this.statusSocket, this.status);
      },
      error: (e: any) => {
        console.log("Error:", e);
      }
    })
  }
}
