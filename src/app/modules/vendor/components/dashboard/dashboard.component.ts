import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonImportsModule } from '../../../common/common-imports/common-imports.module';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../services/vendor.service';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { RouterLink } from '@angular/router';
import { Loading } from 'notiflix';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonImportsModule, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  events: any = []
  isLoading:boolean = false;

  constructor(private router: Router, private vendor: VendorService) {
    this.loadSessions();

    if (!StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/")
    }
  }

  private loadSessions() {
    this.isLoading = true;
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
     })

    const userId = StorageService.getUserId();
    this.vendor.getSessionsByVendor(userId).subscribe(
      (res) => {
        this.events = res;
        Loading.remove()
        this.isLoading = false
      }
    );

    
  }

  goToEventDashboard(eventId: string, event?: Event) {
    if (event) {
      event.stopPropagation(); 
    }
    this.router.navigate([`vendor/sessions/dashboard/`, eventId]);
  }

  stopSession(eventId: string) {
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
     })
    this.vendor.stopSession(eventId).subscribe(
      (res) => {
        console.log(res);
        this.loadSessions();
        Loading.remove(); // Remove loading once data is refreshed
      },
      (err) => {
        console.error(err);
        Loading.remove(); // Also handle errors gracefully
      }
    );
  } 
}