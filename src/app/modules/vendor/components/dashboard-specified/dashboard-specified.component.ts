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

    if (this.eventId != null){
      // Connect to the WebSocket server
      this.vendorService.connect(this.eventId);

      // First, fetch the session details and wait for them to load
      this.vendorService.getSession(this.eventId).subscribe((res) => {
        this.session = res;

        // Once session data is loaded, subscribe to incoming messages
        this.vendorService.getMessages().subscribe((message) => {
          this.ticketPools = message;
          console.log(message + " -from ws");
          console.log(this.ticketPools);

          // Ensure session data is available before calculating sales
          if (this.session) {
            this.sales = (message.releaseTicketCount - message.currentTicketsInPool) * this.session.ticketPrice;
            this.updateChartData(this.ticketPools);
          } else {
            console.error('Session data not available!');
          }
          
          Loading.remove();
        });
      });      
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
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF8A65']
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
          data: [data.totalTickets, data.currentTicketsInPool],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF8A65']
        }
      ]
    };

    const timestamp = new Date()

    if(this.labels.length == 0){
      this.labels.push(new Date(timestamp.getTime() - 30 * 1000).toLocaleTimeString())
      this.ticketCounts.push(0)
    }
  
    this.labels.push(timestamp.toLocaleTimeString());
    this.ticketCounts.push(data.currentTicketsInPool);
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
