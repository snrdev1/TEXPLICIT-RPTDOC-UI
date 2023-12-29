import { Component } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
  pricingOptions: any[] = [
    {
      "icon": "icon-pricing-onetime",
      "plan": "One Time Use",
      "description": "One set of all reports",
      "value": "4,000"
    },
    {
      "icon": "icon-pricing-limited",
      "plan": "Limited Use",
      "description": "Approx 11 sets",
      "value": "20,000"
    },
    {
      "icon": "icon-pricing-high",
      "plan": "High Use",
      "description": "Approx 24 sets",
      "value": "40,000"
    },
  ];
}
