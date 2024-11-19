import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  activeTab: string = 'home';
  isLoading = true;

  constructor(private router: Router, private platform: Platform) {
    // SplashScreen.show({
    //   showDuration: 5000,
    //   autoHide: true,
    // });
  }

  ngOnInit() {
    // Subscribe to NavigationEnd event to get the current URL
    this.initializeApp();
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
        this.isLoading = false;
      }, 3000); // Change this duration to your desired loading time
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // async initializeApp() {
  //   // Simulate load delay for the splash screen
  //   setTimeout(() => {
  //     this.isLoading = false;
  //   }, 3000); // Adjust duration as needed
  // }

}
