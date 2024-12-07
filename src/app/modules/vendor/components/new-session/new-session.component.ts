import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { StorageService } from '../../../../authorization/services/storage/storage.service';
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';
import { Loading } from 'notiflix';
import { CommonImportsModule } from '../../../common/common-imports/common-imports.module';

@Component({
  selector: 'app-new-session',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CommonImportsModule],
  templateUrl: './new-session.component.html',
  styleUrl: './new-session.component.css'
})
export class NewSessionComponent {
  eventForm: FormGroup;
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  minDate: Date;

  constructor(private fb: FormBuilder, private vendor: VendorService, private router: Router) {
    if (!StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/")
    }

    this.minDate = new Date()

    this.eventForm = this.fb.group({
      vendorId: [StorageService.getUserId()],
      eventType: ['', [Validators.required]],
      vipDiscount: ['', [Validators.required, Validators.min(0), Validators.max(60)]],
      eventName: ['', [Validators.required, Validators.minLength(4)]],
      eventVenue: ['', [Validators.required, Validators.minLength(4)]],
      eventCategory: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      eventTime: ['', [Validators.required]],
      ticketPrice: ['', [Validators.required, Validators.min(100)]],
      eventDescription: ['', [Validators.required, Validators.minLength(20)]],
      totalTickets: ['', [Validators.required, Validators.min(10)]],
      ticketReleaseRate: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      customerRetrievalRate: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      maxTicketCapacity: ['', [Validators.required, Validators.min(5)]]
    }, { validators: this.maxCapacityValidator}); 
  }

  maxCapacityValidator(form: FormGroup): null | { mismatch: true } {
    const totalTickets = form.get('totalTickets')?.value;
    const maxTicketCapacity = form.get('maxTicketCapacity')?.value;

    if (totalTickets && maxTicketCapacity && maxTicketCapacity >= totalTickets) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      Loading.hourglass("Loading", {
        svgColor: '#ffffff'
      })
      const formData = new FormData();

      for (const [key, value] of Object.entries(this.eventForm.value)) {
        formData.append(key, value as string);
      }

      if (this.selectedFile) {
        formData.append('eventImage', this.selectedFile);
      }

      this.vendor.configureSession(formData).subscribe((res) => {
        this.router.navigateByUrl("/vendor/sessions")
        console.log(res)
      }, (err) => {
        console.log(err)
        Swal.fire("Error", "Something went wrong", "error")
      })
      Loading.remove()
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }
}
