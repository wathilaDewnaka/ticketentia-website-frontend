import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonImportsModule } from '../../../modules/common/common-imports/common-imports.module';
import { AuthService } from '../../services/auth/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { log } from 'console';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonImportsModule, ProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  countries: string[] = [];
  showPassword: boolean = false;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    if(StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/vendor/sessions")
    } else if(StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/customer/home")
    }

    this.registerForm = this.fb.group({
      userType: ['CUSTOMER', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: ['', [Validators.required]], // Wrap multiple validators in an array
      address: ['', [Validators.required, Validators.minLength(5)]], 
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', [Validators.required, Validators.minLength(9)]],
      brOrNICNumber: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]],
      terms: [false, Validators.requiredTrue], 
    }, { validators: this.passwordMatchValidator });
    

    this.authService.getCountries().subscribe(
      (data) => {
        // Assuming the API returns a list of country objects
        this.countries = data.map(country => country.name.common);  // Use the correct property for country names
      },
      (error) => {
        console.error('Error fetching countries', error);
        this.countries = ["Sri Lanka", "India", "Japan", "Nepal", "America"]
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(form: FormGroup): null | { mismatch: true } {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  

  onSubmit() {
    if (this.registerForm.valid) {
      Loading.hourglass("Loading", {
        svgColor: '#ffffff'
      })

      document.body.style.overflow = 'hidden'

      this.authService.register(this.registerForm.value).subscribe((res) => {
        document.body.style.overflow = ''
        Swal.fire(
          "Registered",
          "User has been registered successfully",
          "success"
        )

        Loading.remove()

        this.router.navigateByUrl('/login')
      }, err => {
        Loading.remove()
        document.body.style.overflow = ''
        Swal.fire(
          "Error", 
          err.error,
          "error"
        )
      })
    }
  }
}
