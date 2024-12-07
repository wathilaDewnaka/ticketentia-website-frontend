import { Component, OnDestroy, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { VendorService } from '../../services/vendor.service';
import { ChartModule } from 'primeng/chart';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from 'notiflix';
import { StorageService } from '../../../../authorization/services/storage/storage.service';

@Component({
  selector: 'app-dashboard-specified',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard-specified.component.html',
  styleUrls: ['./dashboard-specified.component.css'] 
})
export class DashboardSpecifiedComponent implements OnInit, OnDestroy {
  session: any;
  chartData: any;
  vendorName: string = StorageService.getName();
  chartOptions: any;
  chartDataSales: any;
  ticketPoolOptions: any;
  eventId: string | null; 
  ticketPoolData: any;
  ticketPools: any;
  labels: string[] = [];
  ticketCounts: number[] = [];
  sales: number = 0;

  constructor(private vendorService: VendorService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (!StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/")
    }
  }

  ngOnInit(): void {
    Loading.hourglass("Loading", {
      svgColor: '#ffffff'
     })

    // Set up initial chart configuration
    this.chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF8A65']
        }
      ]
    };

    this.chartDataSales = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF8A65']
        }
      ]
    };

    this.ticketPoolData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Ticket Pool',
          data: this.ticketCounts,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    }

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        }
      }
    };

    if (this.eventId) {
      this.vendorService.getSession(this.eventId).subscribe((res) => {
        this.session = res;
        console.log(this.session)
    
        if (this.eventId) {
          // Connect to the WebSocket server
          this.vendorService.connect(this.eventId);
      
          // Once session data is loaded, subscribe to incoming messages
          this.vendorService.getMessages().subscribe((message) => {
            this.ticketPools = message;
      
            if (this.session) {
              this.sales = (message.releaseTicketCount - message.currentTicketsInPool) * this.session.ticketPrice;
              this.updateChartData(this.ticketPools);
            } else {
              console.error('Session data not available!');
            }
      
            
        });
        Loading.remove();
      }
    });

    } else {
      console.error('eventId is null or undefined!');
    }    
  }

  ngOnDestroy(): void {
    // Close the WebSocket connection when the component is destroyed
    this.vendorService.closeConnection();
  }

  updateChartData(data: any): void {
    console.log(data)

    this.chartData = {
      labels: ["Total Tickets", "Tickets in Pool"],
      datasets: [
        {
          data: [data.totalTickets, data.currentTicketsInPool],
          backgroundColor: [ '#FFC20A', '#005A9C'],
          hoverBackgroundColor: ['#64B5F6', '#81C784']
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right'
        }
      },
      animation: {
        duration: 0 // Disable animation
      }
    };

    this.chartDataSales = {
      labels: ["Sold", "Remaining"],
      datasets: [
        {
          data: [this.session.totalTickets - (data.totalTickets + data.currentTicketsInPool), data.totalTickets],
          backgroundColor: ['#4E79A7', '#F28E2B'],
          hoverBackgroundColor: ['#64B5F6', '#81C784']
        }
      ]
    };

    const timestamp = new Date()

    if(this.labels.length == 0){
      this.labels.push(new Date(timestamp.getTime() - 30 * 1000).toLocaleTimeString())
      this.ticketCounts.push((data.currentTicketsInPool > 10) ? data.currentTicketsInPool - 10 : 0)
    }

  
    this.labels.push(timestamp.toLocaleTimeString());
    this.ticketCounts.push(data.currentTicketsInPool);
  

    console.log(this.labels)
    console.log(this.ticketCounts)
    
    this.ticketPoolOptions = {
      animation: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          display: true
        },
        y: {
          display: true
        }
      }
    };

    // Keep the chart to a maximum of 10 data points for clarity
    if (this.labels.length > 10) {
      this.labels.shift();
      this.ticketCounts.shift();
    }

    this.ticketPoolData = { ...this.ticketPoolData }; // Trigger change detection
    this.cdr.detectChanges();
  }
}
