import { Routes } from '@angular/router';
import { HomePageComponent } from './modules/customer/components/home-page/home-page.component';
import { LoginComponent } from './authorization/components/login/login.component';
import { AboutUsComponent } from './modules/customer/components/about-us/about-us.component';
import { RegisterComponent } from './authorization/components/register/register.component';
import { DashboardComponent } from './modules/vendor/components/dashboard/dashboard.component';
import { NewSessionComponent } from './modules/vendor/components/new-session/new-session.component';
import { EventsComponent } from './modules/customer/components/events/events.component';
import { EventSpecifiedComponent } from './modules/customer/components/event-specified/event-specified.component';
import { AboutUsVendorComponent } from './modules/vendor/components/about-us-vendor/about-us-vendor.component';
import { SessionHistoryComponent } from './modules/vendor/components/session-history/session-history.component';
import { DashboardSpecifiedComponent } from './modules/vendor/components/dashboard-specified/dashboard-specified.component';
import { BookingHistoryComponent } from './modules/customer/components/booking-history/booking-history.component';

export const routes: Routes = [
  // Default path redirects to login
  { path: "", redirectTo: "login", pathMatch: "full" },
  
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  { path: "vendor/sessions", component: DashboardComponent },
  { path: "vendor/sessions/dashboard/:id", component: DashboardSpecifiedComponent },
  { path: "vendor/sessions/new-session", component: NewSessionComponent },
  { path: "vendor/about", component: AboutUsVendorComponent },
  { path: "vendor/sessions-history", component: SessionHistoryComponent },
  { path: "vendor/sessions-history/dashboard/:id", component: DashboardSpecifiedComponent },

  { path: "customer/home", component: HomePageComponent },
  { path: "customer/events", component: EventsComponent },
  { path: "customer/events/:id", component: EventSpecifiedComponent },
  { path: "customer/about", component: AboutUsComponent },
  { path: "customer/sessions-history", component: BookingHistoryComponent },

  // Wildcard path redirects to login for undefined routes
  { path: "**", redirectTo: "login" }
];
