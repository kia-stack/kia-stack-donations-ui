// http-client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }


  // Function to handle HTTP GET requests
  get(apiRoute: string): Observable<any> {
    return this.http.get(API_BASE_URL + apiRoute).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Something went wrong while processing your request.');
      })
    );
  }

  // Function to handle HTTP POST requests
  post(apiRoute: string, body: any): Observable<any> {
    return this.http.post(API_BASE_URL + apiRoute, body).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Something went wrong while processing your request.');
      })
    );
  }

  // Function to handle HTTP PUT requests
  put(apiRoute: string, body: any): Observable<any> {
    return this.http.put(API_BASE_URL + apiRoute, body).pipe(
      catchError(error => {
        console.error('Error:', error);
        return throwError('Something went wrong while processing your request.');
      })
    );
  }
}
