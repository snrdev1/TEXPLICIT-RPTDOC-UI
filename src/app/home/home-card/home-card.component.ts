import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent {
  @Input() backgroundImage: string = "";
  @Input() title: string = "";
  @Input() description: string = "";

  constructor(private router: Router){}

  ngOnInit(){
    console.log("Image : ", this.backgroundImage);
  }

  redirectToReports(){
    this.router.navigate(['/reports']);
  }
}
