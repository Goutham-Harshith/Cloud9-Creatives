import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  activeTab: string = 'home';

  constructor(private router: Router, private platform: Platform, private toastr: ToastrService) {}

  ngOnInit() {
    // Subscribe to NavigationEnd event to get the current URL
    this.toastr.success('Operation successful!', 'Success');
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
       this.activeTab = event.url; // Get the current URL
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Simulate a loading delay
      setTimeout(() => {
        // Hide loading spinner
      }, 3000); // Change this duration to your desired loading time
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

}
