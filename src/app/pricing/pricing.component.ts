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
    },
    {
      "icon": "icon-report-resource",
      "title": "Resource",
      "description": "Provides all the references with the description",
    },
    {
      "icon": "icon-report-research",
      "title": "Research",
      "description": "Provides an overview of each of the sections contained",
    },
    {
      "icon": "icon-report-detailed",
      "title": "Detailed",
      "description": "Gives a comprehensive report on all the sections outlined in research",
    },
    {
      "icon": "icon-report-combined",
      "title": "Combined",
      "description": "A combination of the above reports",
    }
  ];

  reportPlans: any[] = [
    {
      "name": "Outline",
      "price": "4000"
    },
    {
      "name": "Resource",
      "price": "4000"
    },
    {
      "name": "Research",
      "price": "4000"
    },
    {
      "name": "Detailed",
      "price": "4000"
    },
    {
      "name": "Complete",
      "price": "4000"
    }
  ];

  constructor(private router: Router){}

  redirectToPayment(){
    this.router.navigate(['/payment']);
  }
}
