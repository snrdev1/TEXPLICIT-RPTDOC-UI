import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private token: string | null = null;

  constructor(
  ) {
    this.token = localStorage.getItem('token');
  }

  getTokenExpirationTime(): number | null {
    if (!this.token) {
      return null;
    }

    const decodedToken: any = jwtDecode(this.token);
    const expirationTime = decodedToken.exp * 1000; // Convert from seconds to milliseconds

    return expirationTime;
  }

  isTokenExpired(): boolean {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) {
      return false; // No token, consider it expired
    }

    const currentTime = Date.now();

    return currentTime > expirationTime;
  }
}
