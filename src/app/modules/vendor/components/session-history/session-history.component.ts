import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule to use ngModel
import { CommonImportsModule } from '../../../common/common-imports/common-imports.module';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-history',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonImportsModule],
  templateUrl: './session-history.component.html',
  styleUrl: './session-history.component.css'
})
export class SessionHistoryComponent{
  events: any = []
  isLoading: boolean = false;

  constructor(private vendor: VendorService, private router: Router) {
    if (!StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/")
    }

    this.isLoading = true
    this.vendor.getInactiveSessionsByVendor(StorageService.getUserId()).subscribe((res) => {
      this.events = res;
      this.isLoading = false
    })
  }

  goToEventDashboard(eventId: string) {
    console.log(eventId)
    this.router.navigate([`vendor/sessions-history/dashboard/`, eventId]);
  }
}
