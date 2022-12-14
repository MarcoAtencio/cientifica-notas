import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { delay } from 'rxjs';
import { LoadingService } from './services/loading.service';

declare var gtag:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cientifica-notas';
  loading: boolean = false;

  constructor(
    private _loading: LoadingService,
    private gtmService: GoogleTagManagerService,
    private router: Router
  ) {
    this.gtmService.addGtmToDom();
  }

  ngOnInit() {
    this.router.events.forEach((item) => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url,
        };

        gtag('config','G-0RPEMMH1EW',{
          'page_path': item.url
        });
      }
    });
    this.listenToLoading();
  }

  /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
