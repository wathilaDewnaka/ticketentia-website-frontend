import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonImportsModule } from '../../../common/common-imports/common-imports.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { RouterLink } from '@angular/router';
import { Loading } from 'notiflix';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonImportsModule, CommonModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  events: any = [];

  constructor(private customer: CustomerService, private router: Router){ 
    if (!StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/")
    }

    this.loadEvents();
  }

  private loadEvents(){
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
    })
    if (StorageService.getUserRole() == "VIP_CUSTOMER"){
      this.customer.getVipEvents().subscribe((res) => {
        this.events = res
        Loading.remove()
      })

      return
    } 
    this.customer.getEvents().subscribe((res) => {
      this.events = res
      Loading.remove()
    })
  }
}
