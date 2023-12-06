import { Component,Input } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
  @Input() detectRoutingOngoing: boolean = false;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    if (this.detectRoutingOngoing) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart
          || event instanceof RouteConfigLoadStart) {
          this.isLoading = true;
        } else if (event instanceof NavigationCancel
          || event instanceof NavigationError
          || event instanceof NavigationEnd
          || event instanceof RouteConfigLoadEnd) {
          this.isLoading = false
        }
      })
    }
  }
}
