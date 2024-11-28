import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StorageService } from './authorization/services/storage/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = "frontend"
  isCustomerLoggedIn: boolean = StorageService.isCustomerLoggedIn()
  isVendorLoggedIn: boolean = StorageService.isVendorLoggedIn()
  customerStatus: string = StorageService.getName()
  customerName: string = StorageService.getName()

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if(event.constructor.name == "NavigationEnd"){
        this.customerStatus = StorageService.getUserRole()
        this.customerName = StorageService.getName()
        this.isVendorLoggedIn = StorageService.isVendorLoggedIn()
        this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn()
      }
    })
  }

  logout(): void{
    StorageService.logout()
    this.router.navigateByUrl("/")
  }
}

