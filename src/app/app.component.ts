import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  public isDarkMode: boolean = false;
  activeTab: string = 'home';
  
  constructor(private dataService: DataService, private router: Router) {
    this.initializeTheme();
  }

  ngOnInit() {

    // Subscribe to NavigationEnd event to get the current URL
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
       this.activeTab = event.url; // Get the current URL
      });
  }

  toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;

    if (this.isDarkMode) {
      this.loadTheme('dark');
    } else {
      this.loadTheme('light');
    }

    // Store the preference in local storage
    localStorage.setItem('dark-theme', this.isDarkMode ? 'true' : 'false');
  }

  async loadTheme(theme: string) {
    // Remove existing theme styles if they are present
    const existingLink = document.getElementById('theme-styles');
    if (existingLink) {
      existingLink.remove();
    }
  
    // Create a new link element for the new theme
    const linkElement = document.createElement('link');
    linkElement.id = 'theme-styles';
    linkElement.rel = 'stylesheet';
    linkElement.href = theme === 'dark' 
      ? 'assets/css/high-contrast-dark.always.css'  // Adjust this path to point to your dark theme
      : 'assets/css/high-contrast.always.css';      // Adjust this path to point to your light theme
  
    // Append the link to the head
    document.head.appendChild(linkElement);
  }
  
  initializeTheme() {
    const storedTheme = localStorage.getItem('dark-theme');
    this.isDarkMode = storedTheme === 'true';
    
    // Load the appropriate theme on initialization
    this.loadTheme(this.isDarkMode ? 'dark' : 'light');
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
