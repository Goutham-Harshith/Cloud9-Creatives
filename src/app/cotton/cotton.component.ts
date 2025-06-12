import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cotton',
  templateUrl: './cotton.component.html',
  styleUrls: ['./cotton.component.scss'],
})
export class CottonComponent implements OnInit {

  alertButtons = ['Go to settings'];
  pricingForm: any = undefined;
  priceList: any;
  bagPrice: any;
  isAlertOpen = false;

  constructor(private fb: FormBuilder, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    let localPriceList: any = localStorage.getItem('priceList')
    this.priceList = JSON.parse(localPriceList);
    this.initAllForms();
  }

  initAllForms() {
    // Initialize the form
    this.pricingForm = this.fb.group({
      width: ['10', Validators.required],
      height: ['10', Validators.required],
      branding: [false],
      handle: ['cottonSmallHandle', Validators.required],
      print: ['single', Validators.required],
    });

  }

  onCottonSubmit() {

    let descriptionText = '';
    let marginPercent = '';

    let formValue = this.pricingForm.value;
    let showMarginCheck =  this.priceList;

    let height = Number(formValue.height);
    let width = Number(formValue.width);
    let cottonCost = this.priceList.cottonCost;
    let cottonSquareInch = this.priceList.cottonSquareInch;
    let labourCost = this.priceList.cottonLabour;
    let current = this.priceList.cottonCurrent;
    let machineDip = this.priceList.cottonMachineDip;
    let miscellaneous = this.priceList.cottonMiscellaneous;

    let singlePrint = this.priceList.cottonSinglePrint;
    let doublePrint = this.priceList.cottonDoublePrint;
    let shortHandle = this.priceList.cottonShortHandle;
    let longHandle = this.priceList.cottonLongHandle;
    let shortTape = this.priceList.cottonSmallTapeHandle;
    let longTape = this.priceList.cottonLongTapeHandle;

    let profitPercentage = 0.65;
    let profitPercentageBranding = 0.5;

    if (formValue.branding) {
      singlePrint = 5;
      doublePrint = 10;
    }

    let totalFabric = ((height + 1) * (width + 1)) * 2;
    let bagCountPerMeter = cottonSquareInch / totalFabric;
    let totalBagCost = cottonCost / bagCountPerMeter;

    let totalPrice = totalBagCost + labourCost + current + machineDip + miscellaneous;

    switch (formValue.print) {
      case 'single':
        totalPrice = totalPrice + singlePrint;
        descriptionText = descriptionText + `
        Single side print`;
        break;
      case "double":
        totalPrice = totalPrice + doublePrint;
        descriptionText = descriptionText + `
        Double side print`;
        break;
      case 'plain':
        descriptionText = descriptionText + `
        without print`;
        break;
    }

    switch (formValue.handle) {

      case "cottonSmallHandle":
        totalPrice = totalPrice + shortHandle;
        descriptionText = descriptionText + `
        Cotton handle`;
        break;
      case 'cottonLongHandle':
        totalPrice = totalPrice + longHandle;
        descriptionText = descriptionText + `
        Cotton Long handle`;
        break;
      case "smallTape":
        totalPrice = totalPrice + shortTape;
        descriptionText = descriptionText + `
        White Tape handle`;
        break;
      case 'longTape':
        totalPrice = totalPrice + longTape;
        descriptionText = descriptionText + `
        White Long Tape handle`;
        break;

    }

    console.log('***** Total Price *********', totalPrice);

    let profit;
    if (formValue.branding) {
      profit = totalPrice * profitPercentageBranding;
      marginPercent = '50%'
    }
    else {
      profit = totalPrice * profitPercentage;
      marginPercent = '65%';
    }

    this.bagPrice = Math.ceil(totalPrice + profit);

    console.log(this.bagPrice);

    const outputElement = document.getElementById("output");
    if (outputElement) {
      let  message = `Description : 

      ${width}w x ${height}h Cotton bag contains the following elements.
      ` + descriptionText
      
      let margin = `

      Margin per bag is ${Math.floor(profit)}/-  (${marginPercent}) 
      `;

      if(!showMarginCheck.hideSettings)
      {
        message = message + margin;
      }

      console.log("message : ", message);

      outputElement.innerHTML = message.replace(/\n/g, "<br>");

    }

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

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
    this.router.navigateByUrl('/dashboard/pricing');
  }

}
