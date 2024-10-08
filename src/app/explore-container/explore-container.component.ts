import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {

  selectedTab : string = 'paper';
  pricingForm: any = undefined;
  paperPricingForm: any = undefined;
  priceList: any;
  isPriceValid : boolean = false;
  isAlertOpen = false;
  alertButtons = ['Go to settings'];
  @ViewChild(IonModal) modal: any;
  bagPrice: any = '';
  bagDescription: string = ''
  paperBagDescription: string = ''
  paperBagWeight: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isAlertOpen = false;
      this.selectedTab = params['tab'];
      console.log('User ID:', this.selectedTab);

      let localPriceList :any = localStorage.getItem('priceList')
      this.priceList = JSON.parse(localPriceList);
      console.log("priceList : ", this.priceList);
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
    });

    // Initialize the form
    this.pricingForm = this.fb.group({
      width: ['10', Validators.required],
      height: ['6', Validators.required],
      gusset: ['5', Validators.required],
      branding: [false, Validators.required],
      zip: [true, Validators.required],
      color: ['white', Validators.required],
      quality: ['14x15', Validators.required],
      handle: ['whiteRope', Validators.required],
      print: ['single', Validators.required],
    });

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

  onJuteSubmit()
  {
    let isSmallBag =  false;
    let descriptionText = '';
    let marginPercent = '';
    let formValue =  this.pricingForm.value;
    let height =  Number(formValue.height);
    let width = Number(formValue.width);
    let gusset =  Number(formValue.gusset);
    let level1 =  ((height + 0.5) * width)*2;
    let level2 =  ((height + 0.5) + width + (height + 0.5))* (gusset + 2.5);
    let level3 = (width - 1)* ( gusset + 1);
    isSmallBag = (Math.ceil(level1) + Math.ceil(level2)) < 300 ? true : false;

    let totalFabric =  Math.ceil(level1) + Math.ceil(level2);

    if(formValue.zip)
    {
      totalFabric = totalFabric + Math.ceil(level3);
    }

    let bagCountPerMeter = Math.floor( (1800/totalFabric)* 10) / 10;
    let fabricPrice;
    

    switch (formValue.color) {
      case 'white':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.white14x15;
          descriptionText = descriptionText + '\n 14x15 quality';
        }
        else {
          fabricPrice = this.priceList.white12x12;
          descriptionText = descriptionText + '\n 12x12 quality' ;
        }
        break;

      case 'natural':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.natural14x15;
          descriptionText = descriptionText + '\n 14x15 quality';
        }
        else {
          fabricPrice = this.priceList.natural12x12;
          descriptionText = descriptionText + '\n  12x12 quality';
        }
        break;
    }

    let fabricCostPerBag =  fabricPrice/bagCountPerMeter;
    let profitPercentage = 0.65 ;
    let profitPercentageBranding = 0.5;
    let labourCost = this.priceList.labour;
    let machineDip =  this.priceList.machineDip;
    let current =  this.priceList.current;
    let thread =  this.priceList.thread;
    let naturalHandle =  this.priceList.naturalHandle;
    let whiteHandle =  this.priceList.whiteHandle;
    let naturalInnerRope =  this.priceList.naturalInnerRope;
    let whiteInnerRope =  this.priceList.whiteInnerRope;
    let dhori =  this.priceList.Dhori;
    let juteHandle =  this.priceList.juteHandle;
    let zip =  this.priceList.zip;
    let print =  this.priceList.print;
    let doublePrint =  this.priceList.doublePrint;
    let miscellaneous = this.priceList.miscellaneous;
    

    if(isSmallBag || formValue.branding)
    {
      print = 5;
      doublePrint = 10;
      labourCost = 15;
    }

    let totalPrice = fabricCostPerBag + labourCost + machineDip + current + thread + miscellaneous;
    
    switch(formValue.print)
    {
      case 'single':
        totalPrice =  totalPrice + print;
        descriptionText = descriptionText + '\n Single side print';
        break;
      case "double":
        totalPrice =  totalPrice + doublePrint;
        descriptionText = descriptionText + '\n Double side print';
        break;
      case 'plain':
        descriptionText = descriptionText + '\n without print';
        break;
    }

    switch (formValue.handle) {
      case "naturalTape":
        totalPrice = totalPrice + naturalHandle;
        descriptionText = descriptionText + '\n Natural tape handle';
        break;
      case "whiteTape":
        totalPrice = totalPrice + whiteHandle;
        descriptionText = descriptionText + '\n White tape handle';
        break;
      case 'naturalRope':
        totalPrice = totalPrice + naturalInnerRope;
        descriptionText = descriptionText + '\n Natural rope handle';
        break;
      case "whiteRope":
        totalPrice = totalPrice + whiteInnerRope;
        descriptionText = descriptionText + '\n White rope handle';
        break;
      case 'dhori':
        totalPrice = totalPrice + dhori;
        descriptionText = descriptionText + '\n Dhori handle';
        break;
      case "juteHandle":
        totalPrice = totalPrice + juteHandle;
        descriptionText = descriptionText + '\n Jute handle';
        break;
    }

    if(formValue.zip)
    {
      totalPrice = totalPrice +  zip;
      descriptionText = descriptionText + '\n includes zip';
    }

    let profit;
    if(formValue.branding)
    {
      profit = totalPrice * profitPercentageBranding;
      marginPercent = '50%'
    }
    else
    {
      profit = totalPrice * profitPercentage;
      marginPercent = '60%'
    }

    this.bagPrice = Math.ceil(totalPrice + profit);

    this.bagDescription = `${width}w x ${height}h x ${gusset}g  ${formValue.color} jute bag contains the following elements.`

    setTimeout(()=>
    {
      const outputElement = document.getElementById("output");
      if (outputElement) {
        const message = `Description : 

        ${width}w x ${height}h x ${gusset}g  ${formValue.color} jute bag contains the following elements.
        ` + descriptionText + `

        Margin per bag is ${Math.floor(profit)}/-  (${marginPercent}) 
        `;
        outputElement.innerHTML = message.replace(/\n/g, "<br>");

      }
    }, 0)

    
    console.log("level1 : ", level1);
    console.log("level2 : ", level2);
    console.log("level3 : ", level3);
    console.log("small bag : ", isSmallBag);
    console.log("Total fabirc : ", totalFabric);
    console.log("Bag Count : ", bagCountPerMeter);
    console.log("fabric price : ", fabricCostPerBag);
    console.log("bag price : ", totalPrice);

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
