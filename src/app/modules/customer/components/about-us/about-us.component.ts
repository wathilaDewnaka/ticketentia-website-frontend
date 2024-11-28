import { Component } from '@angular/core';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
    constructor(private router: Router){
      if (!StorageService.isCustomerLoggedIn()){
        this.router.navigateByUrl("/")
      }
    }
}
