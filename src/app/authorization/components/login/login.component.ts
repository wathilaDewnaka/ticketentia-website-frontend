import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonImportsModule } from '../../../modules/common/common-imports/common-imports.module';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2'
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonImportsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    if(StorageService.isVendorLoggedIn()){
      this.router.navigateByUrl("/vendor/sessions")
    } else if(StorageService.isCustomerLoggedIn()){
      this.router.navigateByUrl("/customer/home")
    }

    this.loginForm = this.fb.group({
      userType: ['CUSTOMER', [Validators.required]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] 
    });    
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        if(res.userId != null){
          Swal.fire(
            'Signed In',
            'Your have been sucessfully signed in.',
            'success'
          )

          const user = {
            id: res.userId,
            role: res.role,
            name: res.name
          }

          StorageService.saveToken(res.token)
          StorageService.saveUser(user)

          if(StorageService.isVendorLoggedIn()){
            this.router.navigateByUrl("/vendor/sessions")
          } else if(StorageService.isCustomerLoggedIn()){
            this.router.navigateByUrl("/customer/home")
          } 
        }
      }, err => {
        Swal.fire(
          'Error',
          "Invalid credentials !",
          'error'
        )
      })
    }
  }
}
