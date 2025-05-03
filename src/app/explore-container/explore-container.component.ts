import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

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
  minOrderQuantity: number = 30;
  bagDescription: string = ''
  paperBagDescription: string = ''
  paperBagWeight: any;
  newJuteBagPrice : number = 0;
  newBagQuantity: number = 0;
  customerNumber: any = '';
  newBagNotes: string = '';
  disableShare: boolean = false;
  normalJutePrice: any;
  bulkJutePrice: any;

  alertButtonsForPrice = [
    {
      text: 'share quote',
      role: 'confirm',
      handler: (inputData: any) => {
        console.log('Alert confirmed with price:', inputData['price']);
        this.newJuteBagPrice = Number(inputData['price']);
        this.newBagQuantity = Number(inputData['quantity']);
        this.downloadAndShareImage(true);
      },
    },
    {
      text: 'Cancel',
      role: 'Same price',
      cssClass: 'danger-button', // Add custom CSS class here
      handler: () => {
        // this.downloadAndShareImage(false);
      },
    },
  ];

  alertButtonsForPrice1 = [
    {
      text: 'Share Dimensions',
      role: 'confirm',
      handler: (inputData: any) => {
        console.log('Alert confirmed with price:', inputData);
        this.newBagQuantity = Number(inputData['quantity']);
        this.newBagNotes =  inputData['notes'];
        this.customerNumber =  inputData['number'];
        this.downloadAndShareDimensions(true);
      },
    },
    {
      text: 'Cancel',
      role: 'Same price',
      cssClass: 'danger-button',
      handler: () => {
        // this.downloadImage(false);
      },
    },
  ];

  alertButtonsForPrice2 = [
    {
      text: 'Download price',
      role: 'confirm',
      handler: (inputData: any) => {
        console.log('Alert confirmed with price:', inputData);
        this.newJuteBagPrice = Number(inputData['price']);
        this.newBagQuantity = Number(inputData['quantity']);
        this.downloadImage(true);
      },
    },
    {
      text: 'Cancel',
      role: 'Same price',
      cssClass: 'danger-button',
      handler: () => {
        // this.downloadImage(false);
      },
    },
  ];

  alertButtonsForPrice3 = [
    {
      text: 'Get Price',
      role: 'confirm',
      handler: (inputData: any) => {
        console.log('Alert confirmed with price:', inputData);
        this.showUpdatedAlert(inputData.quantity);
      },
    },
    {
      text: 'Close',
      role: 'Same price',
      cssClass: 'danger-button',
      handler: () => {
        // this.downloadImage(false);
      },
    },
  ];

   public alertInputs = [
    {
      name: 'price',
      type: 'number' as const,
      placeholder: 'Enter price',
      label: 'Price',
      value: this.bagPrice,
      min: 1,
      max: 1000,
    },
    {
      name: 'quantity',
      type: 'number' as const,
      placeholder: 'Enter quantity',
      label: 'Quanity',
      value: this.minOrderQuantity,
      min: 20,
      max: 100000,
    },

  ];

  public alertInputs1 = [
    {
      name: 'quantity',
      type: 'number' as const,
      placeholder: 'Enter quantity',
      label: 'Quanity',
      value: this.minOrderQuantity,
      min: 20,
      max: 100000,
    },
    {
      name: 'number',
      type: 'text' as const,
      placeholder: 'Enter mobile number',
      label: 'number',
      value: "",
    },
    {
      name: 'notes',
      type: 'text' as const,
      placeholder: 'leave nodes',
      label: 'notes',
      value: "",
    },
  ];

  public alertInputs2 = [
    {
      name: 'price',
      type: 'number' as const,
      placeholder: 'Price',
      value: this.bagPrice,
      min: 1,
      max: 1000,
    },
    {
      name: 'quantity',
      type: 'number' as const,
      placeholder: 'Enter quantity',
      label: 'Quanity',
      value: this.minOrderQuantity,
      min: 20,
      max: 100000,
    },
  ];

  public alertInputs3 = [
    {
      name: 'quantity',
      type: 'number' as const,
      placeholder: 'Enter quantity',
      label: 'Quanity',
      value: this.minOrderQuantity,
      min: 20,
      max: 100000,
    }
  ];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private modalController: ModalController, private toastController: ToastController, private alertController: AlertController ) { }

  ngOnInit() {
    this.initAllForms();
    this.route.queryParams.subscribe(params => {
      this.isAlertOpen = false;
      this.selectedTab = params['tab'];
      console.log('Selected Tab:', this.selectedTab);

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
  }

  ngAfterViewInit() {
    // Listen to navigation changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navigation occurred, performing actions...');
        this.initAllForms();
        if (this.priceList.discountCheck) {
          this.pricingForm.get('branding')?.disable();
        }
      }
    });
  }

  initAllForms() {
    // Initialize the form
    this.pricingForm = this.fb.group({
      width: ['10', Validators.required],
      height: ['6', Validators.required],
      gusset: ['5', Validators.required],
      branding: [false],
      zip: ['zip', Validators.required],
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
    this.disableShare = true;
    setTimeout(() => {
      // enable share button after 5 seconds;
      this.disableShare = false;
    }, 5000)
    this.bagDescription = '';
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

    if(formValue.zip == 'zip')
    {
      totalFabric = totalFabric + Math.ceil(level3);
    }

    let bagCountPerMeter = Math.floor( (1800/totalFabric)* 10) / 10;
    let fabricPrice;
    
    console.log("Total Fabric price : ", totalFabric);

    switch (formValue.color) {
      case 'white':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.white14x15;
          descriptionText = `
          14x15 quality`;
        }
        else {
          fabricPrice = this.priceList.white12x12;
          descriptionText = descriptionText + `
          12x12 quality` ;
        }
        break;

      case 'natural':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.natural14x15;
          descriptionText = descriptionText + `
          14x15 quality`;
        }
        else {
          fabricPrice = this.priceList.natural12x12;
          descriptionText = descriptionText + `
          12x12 quality`;
        }
        break;

      case 'white and natural combination':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.white14x15;
          descriptionText = `
            14x15 quality`;
        }
        else {
          fabricPrice = this.priceList.white12x12;
          descriptionText = descriptionText + `
            12x12 quality` ;
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
    let velcro = this.priceList.velcro
    let print =  this.priceList.print;
    let doublePrint =  this.priceList.doublePrint;
    let miscellaneous = this.priceList.miscellaneous;
    

    if(isSmallBag || formValue.branding)
    {
      print = 5;
      doublePrint = 10;
      if(isSmallBag)
      {
        labourCost = 15;
      }
    }

    let totalPrice = fabricCostPerBag + labourCost + machineDip + current + thread + miscellaneous;

    console.log("small bag price ", totalPrice, labourCost);

    switch(formValue.print)
    {
      case 'single':
        totalPrice =  totalPrice + print;
        descriptionText = descriptionText + `
        Single side print`;
        break;
      case "double":
        totalPrice =  totalPrice + doublePrint;
        descriptionText = descriptionText + `
        Double side print`;
        break;
      case 'plain':
        descriptionText = descriptionText + `
        without print`;
        break;
    }

    switch (formValue.handle) {
      case "naturalTape":
        totalPrice = totalPrice + naturalHandle;
        descriptionText = descriptionText + `
        Natural tape handle`;
        break;
      case "whiteTape":
        totalPrice = totalPrice + whiteHandle;
        descriptionText = descriptionText + `
        White tape handle`;
        break;
      case 'naturalRope':
        totalPrice = totalPrice + naturalInnerRope;
        descriptionText = descriptionText + `
        Natural rope handle`;
        break;
      case "whiteRope":
        totalPrice = totalPrice + whiteInnerRope;
        descriptionText = descriptionText + `
        White rope handle`;
        break;
      case 'dhori':
        totalPrice = totalPrice + dhori;
        descriptionText = descriptionText + `
        Dhori handle`;
        break;
      case "juteHandle":
        totalPrice = totalPrice + juteHandle;
        descriptionText = descriptionText + `
        Jute handle`;
        break;
    }

    switch (formValue.zip) {
      case "zip":
        totalPrice = totalPrice + zip;
        descriptionText = descriptionText + `
      includes zip`;
        break;
      case "velcro":
        totalPrice = totalPrice + velcro;
        descriptionText = descriptionText + `
      includes velcro`;
        break;
      case 'none':
        totalPrice = totalPrice;
        break;
    }

    // if(formValue.zip)
    // {
    //   totalPrice = totalPrice +  zip;
    //   descriptionText = descriptionText + `
    //   includes zip`;
    // }

    // let totalBill = this.newJuteBagPrice * this.newBagQuantity;
    // let advanceAmount =  totalBill/2;

    // let priceQuote = `Quanity : ${this.newBagQuantity}
    // Total Amount = ${totalBill}/-
    // Advance Amount(50%) = ${advanceAmount}/-

    // Please pay the advance amount to confirm your order, after your payment we will add your order to lineup.

    // Important: Please share a screenshot after the payment.
    // `;

    // descriptionText = descriptionText + `
    // ${priceQuote}`;

    console.log('***** Total Price *********', totalPrice, );

    let profit;
    if(formValue.branding)
    {
      profit = totalPrice * profitPercentageBranding;
      marginPercent = '50%'
      if(profit < 20)
      {
        profit = 20;
      }
    }
    else {
      profit = totalPrice * profitPercentage;
      marginPercent = '65%';
      if (profit < 20) {
        profit = 20;
      }
    }

    this.bagPrice = Math.ceil(totalPrice + profit);
    this.alertInputs[0].value = this.bagPrice;
    this.alertInputs[1].value = this.minOrderQuantity;
    this.alertInputs1[0].value = this.minOrderQuantity;
    this.alertInputs2[0].value = this.bagPrice;
    this.alertInputs2[1].value = this.minOrderQuantity;

    let priceList: any = localStorage.getItem("priceList");

    let showMarginCheck =  JSON.parse(priceList);
  
    setTimeout(()=>
    {
      const outputElement = document.getElementById("output");
      if (outputElement) {
        let  message = `Description : 

        ${width}w x ${height}h x ${gusset}g  ${formValue.color} jute bag contains the following elements.
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

        // Split the string into lines, trim spaces, and join them back
        const cleanedString = descriptionText
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines

          console.log("cleaned string : ", cleanedString)

          this.bagDescription = `${width}w x ${height}h x ${gusset}g  ${formValue.color} jute bag contains the following elements.
          ${cleanedString}`;

      }

    }, 0)

    
    console.log("level1 : ", level1);
    console.log("level2 : ", level2);
    console.log("level3 : ", level3);
    console.log("level4 : ", level3);
    console.log("small bag : ", isSmallBag);
    console.log("Total fabirc : ", totalFabric);
    console.log("Bag Count : ", bagCountPerMeter);
    console.log("fabric price : ", fabricCostPerBag);
    console.log("bag price : ", totalPrice);

    this.quantityBasedJutePricing();

  }

  // get quote based on quantity
  quantityBasedJutePricing()
  {
    this.bagDescription = '';
    let isSmallBag =  false;
    let formValue =  this.pricingForm.value;
    let height =  Number(formValue.height);
    let width = Number(formValue.width);
    let gusset =  Number(formValue.gusset);
    let level1 =  ((height + 0.5) * width)*2;
    let level2 =  ((height + 0.5) + width + (height + 0.5))* (gusset + 2.5);
    let level3 = (width - 1)* ( gusset + 1);
    isSmallBag = (Math.ceil(level1) + Math.ceil(level2)) < 300 ? true : false;

    let totalFabric =  Math.ceil(level1) + Math.ceil(level2);

    if(formValue.zip == 'zip')
    {
      totalFabric = totalFabric + Math.ceil(level3);
    }

    let bagCountPerMeter = Math.floor( (1800/totalFabric)* 10) / 10;
    let fabricPrice;

    console.log("Total Fabric price : ", totalFabric);
    
    switch (formValue.color) {
      case 'white':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.white14x15;
        }
        else {
          fabricPrice = this.priceList.white12x12;
        }
        break;

      case 'natural':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.natural14x15;
        }
        else {
          fabricPrice = this.priceList.natural12x12;
        }
        break;

      case 'white and natural combination':
        if (formValue.quality === '14x15') {
          fabricPrice = this.priceList.white14x15;
        }
        else {
          fabricPrice = this.priceList.white12x12;
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
    let velcro = this.priceList.velcro
    let print =  this.priceList.print;
    let doublePrint =  this.priceList.doublePrint;
    let miscellaneous = this.priceList.miscellaneous;

    // bulk checks here
    let bulkPrint =  5;
    let bulkDoublePrint =  10;

    //small size labour cost
    let smallBagLaboutCost = 15;

    let totalPrice = fabricCostPerBag + labourCost + machineDip + current + thread + miscellaneous;

    let bulkTotalPrice = fabricCostPerBag + labourCost + machineDip + current + thread + miscellaneous;

    if(isSmallBag)
    {
      totalPrice = fabricCostPerBag + smallBagLaboutCost + machineDip + current + thread + miscellaneous;
      bulkTotalPrice = fabricCostPerBag + smallBagLaboutCost + machineDip + current + thread + miscellaneous;
    }

    console.log("small bag price : ", totalPrice, bulkTotalPrice, smallBagLaboutCost)

    switch(formValue.print)
    {
      case 'single':
        if (isSmallBag) {
          totalPrice = totalPrice + bulkPrint;
          break;
        }
        totalPrice =  totalPrice + print;
        bulkTotalPrice = bulkTotalPrice + bulkPrint;

        break;
      case "double":
        if (isSmallBag) {
          totalPrice = totalPrice + bulkDoublePrint;
          break;
        }
        totalPrice =  totalPrice + doublePrint;
        bulkTotalPrice = bulkTotalPrice + bulkDoublePrint;
        break;
      case 'plain':
        break;
    }


    switch (formValue.handle) {
      case "naturalTape":
        totalPrice = totalPrice + naturalHandle;
        bulkTotalPrice =  bulkTotalPrice + naturalHandle;
        break;
      case "whiteTape":
        totalPrice = totalPrice + whiteHandle;
        bulkTotalPrice =  bulkTotalPrice + whiteHandle
        ;
        break;
      case 'naturalRope':
        totalPrice = totalPrice + naturalInnerRope;
        bulkTotalPrice =  bulkTotalPrice + naturalInnerRope;
        break;
      case "whiteRope":
        totalPrice = totalPrice + whiteInnerRope;
        bulkTotalPrice =  bulkTotalPrice + whiteInnerRope;
        break;
      case 'dhori':
        totalPrice = totalPrice + dhori;
        bulkTotalPrice =  bulkTotalPrice + dhori;
        break;
      case "juteHandle":
        totalPrice = totalPrice + juteHandle;
        bulkTotalPrice =  bulkTotalPrice + juteHandle;
        break;
    }

    switch (formValue.zip) {
      case "zip":
        totalPrice = totalPrice + zip;
        bulkTotalPrice =  bulkTotalPrice + zip;
        break;
      case "velcro":
        totalPrice = totalPrice + velcro;
        bulkTotalPrice =  bulkTotalPrice + velcro;
        break;
      case 'none':
        totalPrice = totalPrice;
        bulkTotalPrice =  bulkTotalPrice;
        break;
    }

    let normalProfit;
    let bulkProfit;

    bulkProfit = bulkTotalPrice * profitPercentageBranding;
    normalProfit = totalPrice * profitPercentage;

    if(bulkProfit < 20)
    {
      bulkProfit = 20;
    }

    if(normalProfit < 20)
    {
      normalProfit = 20;
    }

    let normalJutePrice = Math.ceil(totalPrice + normalProfit);
    let bulkJutePrice = Math.ceil(bulkTotalPrice + bulkProfit);

    this.normalJutePrice  = Math.floor(normalJutePrice);
    this.bulkJutePrice = Math.floor(bulkJutePrice);

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

 wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => { 
  const lines = text.split('\n'); // Split by line breaks
  
    lines.forEach(line => {
      const words = line.split(' ');
      let currentLine = '';
  
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const testWidth = context.measureText(testLine).width;
  
        if (testWidth > maxWidth && currentLine) {
          context.fillText(currentLine, x, y);
          currentLine = word + ' '; // Start new line with the current word
          y += lineHeight; // Move down for the new line
        } else {
          currentLine = testLine;
        }
      });
  
      context.fillText(currentLine, x, y); // Draw last line
      y += lineHeight; // Move down for the next line
    });
  };

  
  async downloadImage(priceCheck: boolean) {
    try {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load the logo image
        const logo = new Image();
        logo.src = 'assets/icon/logo.png'; // Update this path to where your logo is located;

        logo.onload = async() => {
        // Draw the logo in the center at the top
        const logoWidth = 100; // Adjust the logo width as desired
        const logoHeight = 100; // Adjust the logo height as desired
        const xPosition = (canvas.width - logoWidth) / 2;
        const yPosition = 20; // Top padding for the logo

        ctx.drawImage(logo, xPosition, yPosition, logoWidth, logoHeight);

        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
  
        const priceText = priceCheck ? `Price: ${this.newJuteBagPrice}/-` : `Price: ${this.bagPrice}/-`;
        ctx.fillText(priceText, 10, logoHeight + 40);
  
        const maxWidth = canvas.width - 20;
        const lineHeight = 25;
  
        // Reset bagDescription and create new description content
        this.bagDescription = `Description: ${this.pricingForm.value.width}w x ${this.pricingForm.value.height}h x ${this.pricingForm.value.gusset}g (in inches) ${this.pricingForm.value.color} jute bag contains the following elements.\n`;
  
        const totalBill = this.newJuteBagPrice * this.newBagQuantity;
        const advanceAmount = totalBill / 2;
  
        // Define priceQuote with cleaned alignment
        let priceQuote = `
          Quantity: ${this.newBagQuantity}
          Total Amount: ${totalBill}/-
          Advance Amount (50%): ${advanceAmount}/-

          PhonePe/Gpay :  +91 9771611778 (Pickup Eco Products)
          ACC  : 7286028804 
          IFSC : IDIB000B021
          Bank : Indian Bank
  
          Please pay the advance amount to confirm your order. After your payment, we will add your order to our lineup.

          Delivery : Once bags are completed we will calculate the exact weight. Based on the weight, Transport charges and Balance 50% has to be paid before disptaching your order.
  
          Important: Please share a screenshot after the payment.
        `;
  
        // Clean up alignment of priceQuote
        const cleanedString = priceQuote
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines
  
        // Append additional description elements
        this.bagDescription += `
        ${this.getPrintDescription(this.pricingForm.value.print)}
        ${this.getHandleDescription(this.pricingForm.value.handle)}
        ${this.getZipDescription(this.pricingForm.value.zip)}
        `;
  
        // Append the cleaned price quote
        this.bagDescription += `\n${cleanedString}`;

        this.bagDescription = this.bagDescription
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines

        console.log("Bag Description ", this.bagDescription);
        // Draw the text on the canvas with proper alignment
        this.wrapText(ctx, this.bagDescription, 10, logoHeight + 100, maxWidth, lineHeight);
  
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const base64Data = dataUrl.split(',')[1];
  
        const result = await Filesystem.writeFile({
          path: `bag_price-${Date.now()}.png`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });
  
        console.log('Image saved successfully at:', result.uri);
        this.successToastr();
  
        const displayUri = Capacitor.convertFileSrc(result.uri);
        console.log('Display URI:', displayUri);

        }
      }
    } catch (error) {
      console.error('Error saving image', error);
      this.errorToastr();
    }
  }
  
  async downloadAndShareImage(priceCheck: boolean) {
    try {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load the logo image
        const logo = new Image();
        logo.src = 'assets/icon/logo.png'; // Update this path to where your logo is located

        logo.onload = async() => {

        // Draw the logo in the center at the top
        const logoWidth = 100; // Adjust the logo width as desired
        const logoHeight = 100; // Adjust the logo height as desired
        const xPosition = (canvas.width - logoWidth) / 2;
        const yPosition = 20; // Top padding for the logo

        ctx.drawImage(logo, xPosition, yPosition, logoWidth, logoHeight);

        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
  
        const priceText = priceCheck ? `Price: ${this.newJuteBagPrice}/-` : `Price: ${this.bagPrice}/-`;
        ctx.fillText(priceText, 10, logoHeight + 40);
  
        const maxWidth = canvas.width - 20;
        const lineHeight = 25;
  
        // Reset bagDescription and create new description content
        this.bagDescription = `Description: ${this.pricingForm.value.width}w x ${this.pricingForm.value.height}h x ${this.pricingForm.value.gusset}g (in inches) ${this.pricingForm.value.color} jute bag contains the following elements.\n`;
  
        const totalBill = this.newJuteBagPrice * this.newBagQuantity;
        const advanceAmount = totalBill / 2;
  
        // Define priceQuote with cleaned alignment
        let priceQuote = `
          Quantity: ${this.newBagQuantity}
          Total Amount: ${totalBill}/-
          Advance Amount (50%): ${advanceAmount}/-

          PhonePe/Gpay :  +91 9771611778 (Pickup Eco Products)
          ACC  : 7286028804 
          IFSC : IDIB000B021
          Bank : Indian Bank
  
          Please pay the advance amount to confirm your order. After your payment, we will add your order to our lineup.

          Delivery : Once bags are completed we will calculate the exact weight. Based on the weight, Transport charges and Balance 50% has to be paid before disptaching your order.
  
          Important: Please share a screenshot after the payment.
        `;
  
        // Clean up alignment of priceQuote
        const cleanedString = priceQuote
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines
  
        // Append additional description elements
        this.bagDescription += `
        ${this.getPrintDescription(this.pricingForm.value.print)}
        ${this.getHandleDescription(this.pricingForm.value.handle)}
        ${this.getZipDescription(this.pricingForm.value.zip)}
        `;
  
        // Append the cleaned price quote
        this.bagDescription += `\n${cleanedString}`;

        this.bagDescription = this.bagDescription
        .split('\n') // Split by new line
        .map(line => line.trim()) // Trim spaces from each line
        .join('\n'); // Join the lines back with new lines
  
        // Draw the text on the canvas with proper alignment
        this.wrapText(ctx, this.bagDescription, 10, logoHeight + 100, maxWidth, lineHeight);
  
        const dataUrl = canvas.toDataURL('image/png');
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const base64Data = await this.convertBlobToBase64(blob) as string;
  
        const fileName = `shared-image-${Date.now()}.png`;
        const writeResult = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.External,
        });
  
        const fileUri = writeResult.uri;
  
        await Share.share({
          title: 'Shared Image',
          text: 'Please confirm your order details',
          files: [fileUri],
          dialogTitle: 'Share with...'
        });

        }
        
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  }

  async downloadAndShareDimensions(priceCheck: boolean) {
    try {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
  
        const maxWidth = canvas.width - 20;
        const lineHeight = 25;
  
        // Reset bagDescription and create new description content
        let bagDescription = `Bag Dimensions : ${this.pricingForm.value.width}w x ${this.pricingForm.value.height}h x ${this.pricingForm.value.gusset}g \n`;
        
        let width = Number(this.pricingForm.value.width);
        let height = Number(this.pricingForm.value.height) + 0.5;

        let gussetHeight = height +  width + height;
        let gussetWidth = Number(this.pricingForm.value.gusset) + 2.5;

        let zipWidth =  width - 1;
        let zipHeight =  Number(this.pricingForm.value.gusset) + 1;

        let fbColour;
        let gussetColor;
        let zipColor;

        if(this.pricingForm.value.color == 'white and natural combination')
        {
          fbColour = 'white';
          gussetColor ='natural';
          zipColor = 'white';
        }
        else
        {
          fbColour = this.pricingForm.value.color;
          gussetColor = this.pricingForm.value.color;
          zipColor = this.pricingForm.value.color;
        }

        bagDescription +=  `
        Bag Count   : ${this.newBagQuantity} bags
        Color       : ${this.pricingForm.value.color}
        Quality     : ${this.pricingForm.value.quality}
        Handle      : ${this.getHandleDescription(this.pricingForm.value.handle)}
        Print       : ${this.pricingForm.value.print}
        Mobile no   : ${this.customerNumber}
        Notes       : ${this.newBagNotes}

        ${width} x ${height} ${this.newBagQuantity * 2}pcs  ${fbColour} \n
        ${this.generateMultiplicationTable(width)}
        ${this.generateMultiplicationTable(height)}

        ${gussetHeight} x ${gussetWidth} ${this.newBagQuantity}pcs   ${gussetColor}  \n
        ${this.generateMultiplicationTable(gussetHeight)}
        ${this.generateMultiplicationTable(gussetWidth)} \n`

        if (this.pricingForm.value.zip == 'zip') {
          bagDescription += `
        ${zipWidth} x ${zipHeight} ${this.newBagQuantity}pcs   ${zipColor} \n
        ${this.generateMultiplicationTable(zipWidth)}
        ${this.generateMultiplicationTable(zipHeight)}`
        }

        // Clean up alignment of priceQuote
        const cleanedString = bagDescription
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines

        console.log("Final string : ", cleanedString);

        // Draw the text on the canvas with proper alignment
        this.wrapText(ctx, cleanedString, 10, 25, maxWidth, lineHeight);
  
        const dataUrl = canvas.toDataURL('image/png');
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const base64Data = await this.convertBlobToBase64(blob) as string;
  
        const fileName = `Bag Dimensions-${Date.now()}.png`;
        const writeResult = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.External,
        });
  
        const fileUri = writeResult.uri;
  
        await Share.share({
          title: 'Shared Image',
          text: 'New Order',
          files: [fileUri],
          dialogTitle: 'Share with...'
        });
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  }
  
  // Helper function to convert Blob to Base64
  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
  

  async successToastr() {
    const toast = await this.toastController.create({
      message: 'Price downloaded to your gallery',
      duration: 1500,
      position: 'top',
      swipeGesture: 'vertical',
      color: 'primary',
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

  async errorToastr() {
    const toast = await this.toastController.create({
      message: 'Something went wrong, contact developer',
      duration: 1500,
      position: 'top',
      swipeGesture: 'vertical',
      color: 'danger'
    });

    await toast.present();
  }

  async sharePricesForm() {
    this.alertInputs[0].value = this.bagPrice;
    this.alertInputs[1].value = this.minOrderQuantity;
  
    const alert = await this.alertController.create({
      header: 'Please enter the details.',
      inputs: this.alertInputs, // Use dynamically updated inputs
      buttons: this.alertButtonsForPrice,
      backdropDismiss: false,
    });
  
    await alert.present();
  }
  
  async downloadPricesForm() {
    this.alertInputs2[0].value = this.bagPrice;
    this.alertInputs2[1].value = this.minOrderQuantity;
  
    const alert = await this.alertController.create({
      header: 'Please enter the details',
      inputs: this.alertInputs2, // Use dynamically updated inputs
      buttons: this.alertButtonsForPrice2,
      backdropDismiss: false,
    });
  
    await alert.present();
  }

  async shareBagDimensions() {
    this.alertInputs1[0].value = this.minOrderQuantity;
    const alert = await this.alertController.create({
      header: 'Please enter the quantity',
      inputs: this.alertInputs1, // Use dynamically updated inputs
      buttons: this.alertButtonsForPrice1,
      backdropDismiss: false,
    });
  
    await alert.present();
  }

  // get the pricing based on the quantity.
  async getPricing() {
    const alert = await this.alertController.create({
      header: `Normal : ${this.normalJutePrice}, Bulk : ${this.bulkJutePrice}`,
      inputs: this.alertInputs3, // Use dynamically updated inputs
      buttons: this.alertButtonsForPrice3,
      backdropDismiss: false,
    });
  
    await alert.present();
  }

  getPrintDescription(printType: string): string {
    switch (printType) {
      case 'single':
        return 'Single side print';
      case 'double':
        return 'Double side print';
      default:
        return 'without print';
    }
  }
  
  getHandleDescription(handleType: string): string {
    switch (handleType) {
      case 'naturalTape':
        return 'Natural tape handle';
      case 'whiteTape':
        return 'White tape handle';
      case 'naturalRope':
        return 'Natural rope handle';
      case 'whiteRope':
        return 'White rope handle';
      case 'dhori':
        return 'Dhori handle';
      case 'juteHandle':
        return 'Jute handle';
      default:
        return 'No handle selected';
    }
  }
  
  getZipDescription(zipType: string): string {
    switch (zipType) {
      case 'zip':
        return 'includes zip';
      case 'velcro':
        return 'includes velcro';
      default:
        return 'No closure selected';
    }
  }

  generateMultiplicationTable(number: number): string {
    let table = '';

    for (let i = 1; i <= 15; i++) {
      table += `${number * i}  `;
    }

    return table.trim(); // Remove any trailing whitespace
  }

// Function to show updated alert with price as sub-header
async showUpdatedAlert(quantity: number) {
  let priceDiff = this.normalJutePrice -  this.bulkJutePrice;
  let priceForHundread = priceDiff/5;
  let discountRatio = 0;

  if(quantity >= 100)
  {
      discountRatio = quantity/100;
  }

  let discount = priceForHundread * discountRatio;
  let finalBagPrice = Math.ceil(this.normalJutePrice -  discount);
  
  const alert = await this.alertController.create({
    subHeader: `The best price for ${quantity} jute bags is ${finalBagPrice}rs`,
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      },
    ],
    backdropDismiss: false,
  });

  await alert.present();
}
  
  
  
  
}
