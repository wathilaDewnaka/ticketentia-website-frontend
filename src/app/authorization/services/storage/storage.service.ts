import { Injectable } from '@angular/core';


const TOKEN = "token";
const USER = "user";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static saveToken(token: string): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(TOKEN);
      window.localStorage.setItem(TOKEN, token);
    }
  }

  static saveUser(user: any): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(USER);
      window.localStorage.setItem(USER, JSON.stringify(user));
    }
  }

  
  static getUserId(): string{
    const user = this.getUser()

    if (user == null){
      return ""
    }

    return user.id
  }

  static getToken(): string | null {
    if (this.isBrowser()) {
      return window.localStorage.getItem(TOKEN);
    }
    return null;
  }

  static getUser(): any {
    if (this.isBrowser()) {
      const user = window.localStorage.getItem(USER);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  static getUserRole(): string {
    const user = this.getUser();
    return user ? user.role : "";
  }

  static getName(): string {
    const user = this.getUser();
    return user ? user.name : "NaN";
  }

  static isVendorLoggedIn(): boolean {
    if (!this.isBrowser() || this.getToken() == null) {
      return false;
    }
    return this.getUserRole() === "VENDOR";
  }

  static isCustomerLoggedIn(): boolean {
    if (!this.isBrowser() || this.getToken() == null) {
      return false;
    }
    return this.getUserRole() === "CUSTOMER" || this.getUserRole() === "VIP_CUSTOMER";
  }

  static logout(){
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER); 
  }
}
