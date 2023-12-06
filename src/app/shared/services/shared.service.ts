import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient,
            private router: Router) {}

    
    redirectToHome() {
      this.router.navigate(['/']);
    }
  
}
