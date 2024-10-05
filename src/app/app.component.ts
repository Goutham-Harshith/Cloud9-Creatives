import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  activeTab: string = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to NavigationEnd event to get the current URL
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
       this.activeTab = event.url; // Get the current URL
      });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

}
