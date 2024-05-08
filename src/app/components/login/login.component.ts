import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) { }
  login(): void {
    const apiUrl = `${API_BASE_URL}admin/login`; // Construct API URL using API_BASE_URL

    const credentials = {
      username: this.username,
      password: this.password,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.setItem('isLogged', 'true');
          this.router.navigate(['/#/admin']);
        } else {
          this.error = 'Invalid username or password';
          localStorage.removeItem('isLogged');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        this.error = 'An error occurred. Please try again later.';
      });
  }
}