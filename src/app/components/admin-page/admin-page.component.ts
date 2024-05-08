import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { API_BASE_URL } from '../../constants';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class AdminPageComponent implements OnInit {
  causes: any[] = [];
  donations: any[] = [];
  causeDonations: any[] = [];
  newCauseName: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    const isLogged = localStorage.getItem('isLogged');
    if (!isLogged) {
      this.router.navigate(['/login']);
    } else {
      this.fetchCauses();
      this.fetchDonations();
    }
  }

  fetchCauses() {
    fetch(API_BASE_URL + 'causes')
      .then(response => response.json())
      .then(data => {
        this.causes = data;
        this.mergeData();
      })
      .catch(error => console.error('Error fetching causes:', error));
  }

  fetchDonations() {
    fetch(API_BASE_URL + 'donations')
      .then(response => response.json())
      .then(data => {
        this.donations = data;
        this.mergeData();
      })
      .catch(error => console.error('Error fetching donations:', error));
  }

  mergeData() {
    if (this.causes.length > 0 && this.donations.length > 0) {
      this.causeDonations = this.causes.map(cause => {
        const causeDonations = this.donations.filter(donation => donation.cause_id === cause.cause_id);
        return { ...cause, donations: causeDonations };
      });
    }
  }

  getTotalDonationAmount(cause: any): number {
    return cause.donations.reduce((total: any, donation: any) => total + donation.amount, 0);
  }

  addCause() {
    if (this.newCauseName.trim() === '') {
      alert('Please enter a cause name.');
      return;
    }

    fetch(API_BASE_URL + 'cause', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.newCauseName
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error adding cause.');
        }
        return response.json();
      })
      .then(data => {
        console.log('Cause added successfully:', data);
        // Fetch causes again to update the list
        this.fetchCauses();
        alert("Cause added successfully")
        // Close modal after successful addition
        const addCauseModal = document.getElementById('addCauseBtn');
        if (addCauseModal) {
          // addCauseModal.style.display = 'none';
          addCauseModal.click();
        }
      })
      .catch(error => {
        console.error('Error adding cause:', error);
        alert('Error adding cause. Please try again later.');
      });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('API Key copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy API Key to clipboard.');
      });
  }

  disableCause(causeId: number) {
    const apiUrl = API_BASE_URL + `cause/disable`;

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: causeId }) // Send the causeId in the request body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to disable cause');
        }
        console.log('Cause disabled successfully');
        this.fetchCauses();
      })
      .catch(error => {
        console.error('Error disabling cause:', error);
      });
  }

  enableCause(causeId: number) {
    const apiUrl = API_BASE_URL + `cause/enable`;

    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: causeId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to enable cause');
        }
        console.log('Cause disabled successfully');
        this.fetchCauses();
      })
      .catch(error => {
        console.error('Error disabling cause:', error);
      });
  }



  logOut() {
    localStorage.removeItem('isLogged');
    this.router.navigateByUrl("/");
  }
}
