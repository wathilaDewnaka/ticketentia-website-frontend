import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../authorization/services/storage/storage.service';

@Component({
  selector: 'app-about-us-vendor',
  standalone: true,
  imports: [],
  templateUrl: './about-us-vendor.component.html',
  styleUrl: './about-us-vendor.component.css'
})
export class AboutUsVendorComponent {
    constructor(private router: Router){
      if (!StorageService.isVendorLoggedIn()){
        this.router.navigateByUrl("/")
      }
    }
}
