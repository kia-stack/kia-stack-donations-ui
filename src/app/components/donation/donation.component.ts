import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../constants';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class DonationComponent implements OnInit {
  causes: any[] = [];
  selectedCause: any = null;
  name: string = '';
  email: string = '';
  amount: number = 0;

  ngOnInit(): void {
    this.fetchCauses();
  }

  fetchCauses(): void {
    fetch(API_BASE_URL + 'causes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching causes.');
        }
        return response.json();
      })
      .then((data) => {
        this.causes = data.filter((d: any) => d.isDisabled == 0);
      })
      .catch((error) => {
        console.error('Error fetching causes:', error);
      });
  }

  openModal(cause: any): void {
    this.selectedCause = cause;
  }

  closeModal(): void {
    this.selectedCause = null;
  }

  donate(): void {
    if (!this.validateForm()) {
      return;
    }

    fetch(API_BASE_URL + 'donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cause_id: this.selectedCause.cause_id,
        name: this.name,
        email: this.email,
        amount: this.amount,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error donating.');
        }
        alert('Donation successful!');
        this.closeModal()
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => {
        alert('Error donating. Please try again later.');
        console.error('Error donating:', error);
      });
  }

  validateForm(): boolean {
    if (!this.name || !this.email || this.amount <= 0) {
      alert('Please fill in all fields.');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  }
}
