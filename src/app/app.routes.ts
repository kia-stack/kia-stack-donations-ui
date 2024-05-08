import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { DonationComponent } from './components/donation/donation.component';

export const routes: Routes = [
    { path: "", component: DonationComponent },
    { path: "login", component: LoginComponent },
    { path: "admin", component: AdminPageComponent }
];
