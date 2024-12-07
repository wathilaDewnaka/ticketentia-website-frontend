import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { CommonImportsModule } from '../../../common/common-imports/common-imports.module';
import { Loading } from 'notiflix';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, CommonImportsModule],
  templateUrl: './booking-history.component.html',
  styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {
  tickets:any = [];
  isLoading: boolean = false;

  constructor(private customer: CustomerService, private router: Router) {
    if (!StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/")
    }

    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
      })
    
    this.isLoading = true
    document.body.style.overflow = 'hidden'
    this.customer.getHistory(StorageService.getUserId()).subscribe((res) => {
      this.tickets = res;
      this.isLoading = false
      document.body.style.overflow = ''
      Loading.remove()
    })
  }
}
