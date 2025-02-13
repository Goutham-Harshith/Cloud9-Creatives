import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public isDarkMode: boolean = false;
  hideSettings: boolean = true;
  
  constructor() {
    let priceList: any = localStorage.getItem("priceList");
    let settingCheck = JSON.parse(priceList);
    this.hideSettings = settingCheck.hideSettings;
    console.log()
    let localMode = localStorage.getItem('darkMode');
    this.isDarkMode = localMode == "true" ?  true : false;
    if (this.isDarkMode) {
      this.loadTheme('dark');
    } else {
      this.loadTheme('light');
    }
  }

  toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;
    localStorage.setItem("darkMode", JSON.stringify(this.isDarkMode));
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    document.body.classList.toggle('light-theme', !this.isDarkMode);

    if (this.isDarkMode) {
      this.loadTheme('dark');
    } else {
      this.loadTheme('light');
    }
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

  navigateToSettings()
  {
      console.log("price : ", this.hideSettings)
  }

}
