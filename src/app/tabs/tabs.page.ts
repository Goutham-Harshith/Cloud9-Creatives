import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild(IonModal) modal!: IonModal;
  public isDarkMode: boolean = false;
  hideSettings: boolean = true;
  securityPassword: string = '';
  
  constructor(private toastController: ToastController, private router: Router) {
    let priceList: any = localStorage.getItem("priceList");
    let settingCheck = JSON.parse(priceList);
    this.hideSettings = settingCheck?.hideSettings;
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

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.securityPassword = '';
  }

  confirm() {
    if(this.securityPassword != "Test@123")
    {
      this.errorToastr();
      return;
    }
    this.modal.dismiss(null, 'cancel');
    this.successToastr();
    this.router.navigate(['/dashboard/pricing']); // Change the route accordingly
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    console.log("dismissed ");
    this.securityPassword = '';
  }

  async errorToastr() {
    const toast = await this.toastController.create({
      message: 'Wrong password please try again',
      duration: 1500,
      position: 'top',
      swipeGesture: 'vertical',
      color: 'danger'
    });

    await toast.present();
  }

  async successToastr() {
    const toast = await this.toastController.create({
      message: 'Success',
      duration: 1500,
      position: 'top',
      swipeGesture: 'vertical',
      color: 'success',
      cssClass: 'toast-top-right',
      animated: true,
      icon: "checkmark-circle-outline",
      buttons: [
        {
          icon: 'close', // Add dismiss icon here (Ionicons, e.g., 'close' or 'close-circle')
          role: 'cancel', // Defines a "cancel" role that dismisses the toast
          handler: () => {
            console.log('Toast dismissed');
          }
        }
      ]
    });

    await toast.present();
  }

}
