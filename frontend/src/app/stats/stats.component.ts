import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Papa } from 'ngx-papaparse'; // Install papaparse for CSV handling
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgForOf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  imports: [NgForOf, HttpClientModule, RouterOutlet],
})
export class StatsComponent implements OnInit {
  urls: any[] = [];

  constructor(
    private http: HttpClient,
    private papa: Papa,
  ) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.http
      .get<{ stats: any[] }>('http://localhost:3250/stats') // Adjust the API URL
      .pipe(
        catchError((error) => {
          console.error('Error fetching stats:', error);
          return of({ stats: [] });
        }),
      )
      .subscribe((response) => {
        this.urls = response.stats;
      });
  }

  downloadCsv(): void {
    const csvData = this.papa.unparse(this.urls);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'url_stats.csv';
    a.click();
    URL.revokeObjectURL(url); // Free up the memory after download
  }
}
