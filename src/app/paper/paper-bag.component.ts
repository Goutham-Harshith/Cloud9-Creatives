import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-paper-bag',
  templateUrl: './paper-bag.component.html',
  styleUrls: ['./paper-bag.component.scss'],
})
export class PaperBagComponent  implements OnInit {


  pricingForm: any = undefined;
  paperPricingForm: any = undefined;
  priceList: any;
  isAlertOpen = false;
  @ViewChild(IonModal) modal: any;
  paperBagDescription: string = ''
  paperBagWeight: any;
  alertButtons = ['Go to settings'];

  constructor( private fb: FormBuilder, private router: Router, private modalController: ModalController ) { }

  ngOnInit() {
    this.initAllForms();
    let localPriceList :any = localStorage.getItem('priceList')
    this.priceList = JSON.parse(localPriceList);
    let keys= Object.keys(this.priceList);
    keys.forEach((key)=>
    {
      if(this.priceList[key] === null)
      {
        setTimeout(()=>
        {
          this.isAlertOpen = true;
        }, 0)
      }
    })
  }

  ngAfterViewInit() {
    // Listen to navigation changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.initAllForms();
      }
    });
  }

  initAllForms() {
    // Initialize the form
    this.paperPricingForm = this.fb.group({
      bagSize: ['mini', Validators.required],
      quantity: [20, Validators.required]
    });
  }

  onPaperSubmit()
  {
      console.log(this.paperPricingForm.value);
      let quantity = this.paperPricingForm.value.quantity;
      this.paperBagWeight = 0;
      this.paperBagDescription = ``
    switch (this.paperPricingForm.value.bagSize) {
      case 'mini':
        this.paperBagWeight = (this.priceList.mini * quantity) / 1000;
        this.paperBagDescription = `the above weight is for Mini bags of ${quantity} quantity`
        break;
      case 'small':
        this.paperBagWeight = (this.priceList.small * quantity) / 1000;
        this.paperBagDescription = `the above weight is for Small bags of ${quantity} quantity`;
        break;
      case 'medium':
        this.paperBagWeight = (this.priceList.medium * quantity) / 1000;
        this.paperBagDescription = `the above weight is for Medium bags of ${quantity} quantity`;
        break;
    }

  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    this.router.navigateByUrl('/dashboard/pricing');
  }

  async openModal(modalId: string) {
    const modal = await this.modalController.getTop();
    if (modal) {
      modal.dismiss(); // Dismiss any existing modal first if open
    }

    const modalElement = document.querySelector(`#${modalId}`) as HTMLIonModalElement;
    if (modalElement) {
      await modalElement.present();
    }
  }

  async closeModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  
  
  
  
}
