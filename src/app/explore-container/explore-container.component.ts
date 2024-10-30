import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { ToastrService } from 'ngx-toastr';

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
  newJuteBagPrice : number = 0;

  alertButtonsForPrice = [
    {
      text: 'Change price',
      role: 'confirm',
      handler: (inputData: any) => {
        console.log('Alert confirmed with price:', inputData['0']);
        this.newJuteBagPrice = inputData['0'];
        this.downloadImage(true);
      },
    },
    {
      text: 'Continiue with same price',
      role: 'Same price',
      handler: () => {
        this.downloadImage(false);
      },
    },
  ];

   public alertInputs = [
    {
      type: 'number',
      placeholder: 'Price',
      value: 1,
      min: 1,
      max: 100,
    }
  ];

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private modalController: ModalController, private toastrService: ToastrService) { }

  ngOnInit() {
    this.toastrService.success('Operation successful!', 'Success');
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
      if(isSmallBag)
      {
        labourCost = 15;
      }
    }

    let totalPrice = fabricCostPerBag + labourCost + machineDip + current + thread + miscellaneous;
    
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

    if(formValue.zip)
    {
      totalPrice = totalPrice +  zip;
      descriptionText = descriptionText + `
      includes zip`;
    }

    console.log('***** Total Price *********', totalPrice);

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
    this.alertInputs[0].value = this.bagPrice

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

        // Split the string into lines, trim spaces, and join them back
        const cleanedString = descriptionText
          .split('\n') // Split by new line
          .map(line => line.trim()) // Trim spaces from each line
          .join('\n'); // Join the lines back with new lines


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
      // Get the canvas element
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Set text style
        ctx.fillStyle = '#000000';
        ctx.font = '20px Arial';
  
        // Add price text
        const priceText = priceCheck ? `Price: ${this.newJuteBagPrice}/-` : `Price: ${this.bagPrice}/-`;
        ctx.fillText(priceText, 10, 50);
  
        // Set the bag description with line breaks
        const maxWidth = canvas.width - 20;
        const lineHeight = 25;
        this.wrapText(ctx, this.bagDescription, 10, 100, maxWidth, lineHeight);
  
        // Convert canvas to image
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const base64Data = dataUrl.split(',')[1];
  
        // Write file to the external directory
        const result = await Filesystem.writeFile({
          path: 'bag_price.png',
          data: base64Data,
          directory: Directory.Documents, // or use Directory.External for Android
          recursive: true,
        });
  
        // Log success and provide the saved path for debugging
        this.toastrService.success("Image downloaded into your gallery")
        console.log('Image saved successfully at:', result.uri);
  
        // Optionally, convert URI to a shareable format
        const displayUri = Capacitor.convertFileSrc(result.uri);
        console.log('Display URI:', displayUri);
      }
    } catch (error) {
      this.toastrService.error("Failed to download quote, contact developer");
      console.error('Error saving image', error);
    }
  }

  async downloadAndShareImage() {
    try {
      // Generate the image on the canvas
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const dataUrl = canvas.toDataURL('image/png');
  
      // Convert the data URL to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
  
      // Convert Blob to Base64
      const base64Data = await this.convertBlobToBase64(blob) as string;
  
      // Define the file name and save it to the external directory
      const fileName = `shared-image-${Date.now()}.png`;
      const writeResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.External, // or Directory.Documents for broad accessibility
      });
  
      // Use the full path for sharing
      const fileUri = Capacitor.convertFileSrc(writeResult.uri);
  
      // Share the file using the Share API
      await Share.share({
        title: 'Shared Image',
        text: 'Check out this image!',
        url: fileUri,
        dialogTitle: 'Share with...'
      });
  
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
  
  
  
}
