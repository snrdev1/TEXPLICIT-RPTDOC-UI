import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  basicReports: any[] = [
    {
      "icon": "icon-report-outline",
      "title": "Outline",
      "description": "Bullets outlining topic",
      "price": 4000
    },
    {
      "icon": "icon-report-research",
      "title": "Summary",
      "description": "Provides an overview of each of the sections contained",
      "price": 4000
    },
    {
      "icon": "icon-report-detailed",
      "title": "Detailed",
      "description": "Gives a comprehensive report on all the sections outlined in research",
      "price": 4000
    },
    {
      "icon": "icon-report-combined",
      "title": "Combined",
      "description": "A combination of the above reports",
      "price": 4000
    }
  ];

  constructor(private router: Router){}

  redirectToPayment(){
    this.router.navigate(['/payment']);
  }
}
