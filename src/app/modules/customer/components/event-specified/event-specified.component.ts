import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-specified',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-specified.component.html',
  styleUrl: './event-specified.component.css'
})
export class EventSpecifiedComponent implements OnInit, OnDestroy {
  event: any = [];
  eventId: string | null; 
  quantity: number = 1; 
  stock: number = 0;
  totalPrice: number = 0;

  constructor(private route: ActivatedRoute, private customer: CustomerService, private router: Router) {
    if (!StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/")
    }

    this.eventId = this.route.snapshot.paramMap.get('id');
  }

  updatePrice() {
    this.totalPrice = this.quantity * this.event.ticketPrice;
  }

  // Handle quantity changes
  onQuantityChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10);
    this.quantity = isNaN(value) || value < 1 ? 1 : value; 
    this.updatePrice();
  }

  // Handle ticket purchase
  purchaseTickets() {
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
    })

    if (this.quantity > 10){
      Swal.fire("Error", "Unable to purchase tickets", "error")
      return
    }

    this.customer.buyTicket({
      quantity: this.quantity,
      sessionId: this.eventId,
      customerId: StorageService.getUserId()
    }).subscribe((res) => {
      if (StorageService.getUserRole() === "CUSTOMER" && res.userRole === "VIP_CUSTOMER"){
          StorageService.logout()
      }
      Loading.remove()

      this.router.navigateByUrl("/customer/home")
      Swal.fire("Tickets purchased sucessfully", "Tickets will be added to my tickets shortly", "success")
    }, (err) => {
      Loading.remove()
      
      this.router.navigateByUrl("/customer/home")
      Swal.fire("Error", "Unable to purchase tickets", "error")
    })
  }

  ngOnInit(): void {
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
    })
    if(this.eventId != null){
      this.customer.getEvent(this.eventId).subscribe((res) => {
        this.event = res

        if(this.eventId != null){
          this.customer.connect(this.eventId);
          this.customer.getMessages().subscribe((message) => {
            this.stock = message.totalTickets + message.currentTicketsInPool;
            Loading.remove()
          })
        }
      })
    }
  }
  
  
  ngOnDestroy(): void {
    this.customer.closeConnection()
  }
    
}
