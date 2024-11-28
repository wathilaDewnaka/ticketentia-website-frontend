import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../authorization/services/storage/storage.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  constructor(private router: Router){
    if (!StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/")
    }
  }
}
