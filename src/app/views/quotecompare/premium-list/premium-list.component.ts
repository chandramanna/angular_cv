import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';
import {NgbAccordionConfig,NgbModal, ModalDismissReasons,NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../services/ngb-date-fr-parser-formatter";

@Component({
  selector: 'app-PremiumList',
  templateUrl: './premium-list.component.html',
  styleUrls: ['../../../../assets/quotecompare/css/main.css'],
  providers: [NgbAccordionConfig,{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
})
export class PremiumListComponent implements OnInit {
	countCompare:number=0;
	callMeBack:FormGroup;
	quoteJson: any;
	showquoteData: any;
	showPremiumData: any;
	countResultPremium: any;
	premiumBreakupJson: any;
	currDate: any;
	isRenewal:any;
	maufacYear: any[] =[];
	lastClaimYears: any[] =[];
	form_premium_type: string;
	premiumJson: any[] = [];
	closeResult: string;
	quoteUrl: string;
	quoteModifyForm: FormGroup;
	quoteModifyLeftForm: FormGroup;
	shareForm: FormGroup;
	zeroDepBool: boolean = false;
	paOwnerBool: boolean = false;
	showCustomIDV: boolean = false;
	shareFormSubmitted: boolean = false;
	shareFormMsg: boolean = false;
	shareErrorMsg: boolean = true;
	validQuoteModifyLeft: boolean = true;
	minIDV: any = 0;
	maxIDV: any = 0;
	
	maxRelianceIDV: any = 0;
	maxHdfcIDV: any = 0;
	
	minRelianceIDV: any = 0;
	minHdfcIDV: any = 0;
	
	modifyIDV: any = 0;
	months: any;
	callMeBackSubmit=true;
	APIURL: string = "http://192.168.7.124/gibl-php/cv-services/";
	//APIURL: string = "http://uat.gibl.in/tw-services/";
	
	constructor(public fb: FormBuilder,protected localStorage: LocalStorage,private router: Router,private  apiService:  ApiService,config: NgbAccordionConfig,private modalService: NgbModal,private route:ActivatedRoute,) {
		config.closeOthers = true;
        config.type = 'info';
		this.months=["","Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	}
	
	ngOnInit() {
		this.showquoteData=false;
		this.isRenewal=true;
		let now = new Date();
		this.currDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
		var curr_year = new Date().getFullYear();
		var last_year = new Date().getFullYear()-15;
		
		for (let i = curr_year-1; i > last_year; i--) {
			this.maufacYear.push(i);
		}
		
		this.callPremiumApiService();
		this.generateModifyQuoteForm();
		this.generateShareForm();
		this.createCallMeBackForm();
		this.updateLastClaimYear();
	}
	
	updateLastClaimYear(){
		this.lastClaimYears=[];
		let now = new Date();
		this.currDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
		var curr_year = new Date().getFullYear();
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			let manufactureYear=this.quoteJson.manufacture_date.year;
			for (let i = curr_year-1; i >= manufactureYear; i--) {
				this.lastClaimYears.push(i);
			}
		});
	}
	
	callPremiumApiService()
	{
		this.countResultPremium=0;
		this.showPremiumData=false;
		this.premiumJson=[];
		this.route.queryParams.subscribe(params => {
			if(params.QID!=null)
			{
				this.getQuoteData(params.QID);
			}
			else
			{
				this.callServices();
			}
		});
		
	}
	getQuoteData(QID)
	{
		
		let getquoteJson={
			"QID":QID,
			"serviceUrl":""
		};
		getquoteJson.serviceUrl=this.APIURL+"service.php?action=GET_PREMIUM";
		
		this.apiService.getPremium(getquoteJson).subscribe(data => {
			let resData=data;
			let quoteStoredJSON : any;
			quoteStoredJSON=resData;
			console.log(quoteStoredJSON);

			this.localStorage.setItem('quoteJson', JSON.parse(quoteStoredJSON)).subscribe(() => {
				this.callServices();
			});
		});
	}
	call_me_back_submit(){
		let callMeBack = this.callMeBack.value;
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let getquoteJson={
				"QID":data,
				"mobileNo":callMeBack.MobileNo,
				"serviceUrl":""
			};
	
			getquoteJson.serviceUrl=this.APIURL+"service.php?action=STORE_CALLBACK";
			this.apiService.call_me_back_submit(getquoteJson).subscribe(data => {
				this.callMeBackSubmit=false;
			});
		});
	}
	callServices()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			
			this.form_premium_type=this.quoteJson.form_premium_type;
			if(this.form_premium_type=="0")
			{
				this.isRenewal=false;
			}
			this.showquoteData=true;
			this.populateModifyQuoteForm();
			//console.log(this.quoteJson);
			this.storePremium();
			this.hdfcGetPremium();
			//this.relianceGetPremium();
			//this.newindiaGetPremium();
		});
	}
	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			//size: 'sm',//
			backdrop: 'static',
			keyboard  : false,
			centered: true}).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}
	compareModal(content,event) {
		console.log(event)
		if(event.target.checked)
		{
			this.modalService.open(content, {
				ariaLabelledBy: 'modal-basic-title',
				//size: 'sm',//
				backdrop: 'static',
				keyboard  : false,
				centered: true}).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			}, (reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			});
			this.countCompare++;
		}
	}
	
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return  `with: ${reason}`;
		}
	}
	showDivCustomIDV(bool)
	{
		this.showCustomIDV=bool;
	}
	/***********************************************************************************************************************/
													//Set Premium Breakup
	/***********************************************************************************************************************/
	premiumBreakup(premiumItem)
	{
		
		this.premiumBreakupJson=premiumItem;
		//console.log(this.premiumBreakupJson);
		
	}
	
	/***********************************************************************************************************************/
													//Share Form Details
	/***********************************************************************************************************************/
	createCallMeBackForm(){
		this.callMeBack = this.fb.group({
			MobileNo: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
		});
	}
	generateShareForm()
	{
		this.shareForm = this.fb.group({
			refEmailAddress: ['',[Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
			refMobileNo: ['',[Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
		
	}
	get f() { return this.shareForm.controls; }
	generateLink()
	{
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let quoteID=data;
			this.quoteUrl=window.location.href;
			this.quoteUrl=this.quoteUrl+"?QID="+quoteID;
			this.shareForm.get('QuoteUrl').setValue(this.quoteUrl);
		});
		
	}
	shareFormSubmit()
	{
		//console.log(this.shareForm.value);
		this.shareFormSubmitted = true;
		if (this.shareForm.invalid) {
			return;
		}
		else
		{
			if(this.shareForm.value.refEmailAddress=="" && this.shareForm.value.refMobileNo=="")
			{
				this.shareErrorMsg=false;
			}
			else
			{
				this.shareErrorMsg=true;
				let shareFormData = this.shareForm.value;
				this.sendSmsEmailApiService(shareFormData);
				this.shareFormMsg=true;
			}
		}
		
	}
	sendSmsEmailApiService(shareFormData)
	{
		shareFormData.serviceUrl=this.APIURL+"service.php?action=SEND_SMS_EMAIL";
		
		this.apiService.sendSmsEmail(shareFormData).subscribe(data => {
			
		});

		
	}
	/***********************************************************************************************************************/
													//Modify Policy Details
	/***********************************************************************************************************************/
	
	
	
	
	generateModifyQuoteForm()
	{
		this.quoteModifyForm = this.fb.group({
			modifyExpiryDate: [''],
			modifyRegistrationDate: [''],
			modifyManufacDateMM: [''],
			modifyManufacDateYY: [''],
		});
		this.quoteModifyLeftForm = this.fb.group({
			customIDV: ['0'],
			modifyIDV: ['0'],
			isClaimed: ['0'],
			lastClaimedYear: ['Never'],
			modifyNCB: ['0'],
			modifyDiscount: ['0'],
			isOccupation:['0'],
			occupationType:['0'],
			isAge:['0'],
			dob:[''],
			isMotorAssociation:['0'],
			associationName:[''],
			membershipNo:[''],
			expiryDate:[''],
			antiTheftDevice:['0'],
			carAccessories:[null],
			nonElectricalAccessories:[null],
			cngLpgKit:[null],
			imt:['0'],
			coverType:['']
		});	
		let modifyDobDate = {year: 1980, month: 1, day: 1};
		this.quoteModifyLeftForm.get('dob').setValue(modifyDobDate);
	}
	get getQMLF() { return this.quoteModifyLeftForm.controls; }
	populateModifyQuoteForm()
	{
		let modifyExpiryDate = {year: this.quoteJson.policy_expiry_date.year, month: this.quoteJson.policy_expiry_date.month, day: this.quoteJson.policy_expiry_date.day};
		this.quoteModifyForm.get('modifyExpiryDate').setValue(modifyExpiryDate);
		
		let modifyRegistrationDate = {year: this.quoteJson.registration_date.year, month: this.quoteJson.registration_date.month, day: this.quoteJson.registration_date.day};
		this.quoteModifyForm.get('modifyRegistrationDate').setValue(modifyRegistrationDate);
		
		//let modifyManufacDate = {year: this.quoteJson.manufacture_date.year, month: this.quoteJson.manufacture_date.month, day: this.quoteJson.manufacture_date.day};
		this.quoteModifyForm.get('modifyManufacDateMM').setValue(this.quoteJson.manufacture_date.month);
		this.quoteModifyForm.get('modifyManufacDateYY').setValue(this.quoteJson.manufacture_date.year);
		
		this.quoteModifyLeftForm.patchValue({"modifyNCB":this.quoteJson.prev_ncb});
		this.quoteModifyLeftForm.patchValue({"modifyDiscount":this.quoteJson.vol_discount});
	}
	quoteModifySubmit()
	{
		let modifyData = this.quoteModifyForm.value;
		this.quoteJson.manufacture_date={year: modifyData.modifyManufacDateYY, month: modifyData.modifyManufacDateMM, day:1};
		this.quoteJson.policy_expiry_date={year: modifyData.modifyExpiryDate.year, month: modifyData.modifyExpiryDate.month, day:modifyData.modifyExpiryDate.day};
		this.quoteJson.registration_date={year: modifyData.modifyRegistrationDate.year, month: modifyData.modifyRegistrationDate.month, day:modifyData.modifyRegistrationDate.day};
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
			this.updateLastClaimYear();
		});
		
	}
	quoteModifyLeftSubmit()
	{
		
		console.log("maxRelianceIDV: "+this.maxRelianceIDV);
		console.log("minRelianceIDV: "+this.minRelianceIDV);
		console.log("maxHdfcIDV: "+this.maxHdfcIDV);
		console.log("minHdfcIDV: "+this.minHdfcIDV);
		let modifyData = this.quoteModifyLeftForm.value;
		
		if(modifyData.modifyIDV < this.minIDV || modifyData.modifyIDV > this.maxIDV)
		{
			this.validQuoteModifyLeft=false;
		}
		else
		{
			this.validQuoteModifyLeft=true;
			let new_ncb=20;
			let modifyVal=modifyData.modifyNCB;
			switch(modifyVal)
			{
				case '0': new_ncb = 20; break;
				case '20': new_ncb = 25; break;
				case '25': new_ncb = 35; break;
				case '35': new_ncb = 45; break;
				case '45': new_ncb = 50; break;
				case '50': new_ncb = 50; break;
			}
			this.quoteJson.prev_ncb = modifyData.modifyNCB;
			this.quoteJson.new_ncb = new_ncb;
			this.quoteJson.last_claimed_year = modifyData.isClaimed;
			this.quoteJson.last_claimed_year = 0;
			this.modifyIDV = modifyData.modifyIDV;
			this.quoteJson.idv = modifyData.modifyIDV;
			this.quoteJson.vol_discount = modifyData.modifyDiscount;
			this.quoteJson.occupationType = modifyData.occupationType;
			this.quoteJson.dob = modifyData.dob;
			this.quoteJson.associationName = modifyData.associationName;
			this.quoteJson.membershipNo = modifyData.membershipNo;
			this.quoteJson.expiryDate = modifyData.expiryDate;
			this.quoteJson.expiryDate = modifyData.expiryDate;
			this.quoteJson.antiTheftDevice = modifyData.antiTheftDevice;
			this.quoteJson.carAccessories = modifyData.carAccessories;
			this.quoteJson.nonElectricalAccessories = modifyData.nonElectricalAccessories;
			this.quoteJson.cngLpgKit = modifyData.cngLpgKit;
			this.quoteJson.imt = modifyData.imt;
			this.quoteJson.coverType = modifyData.coverType;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		
	}
/* 	zeroDepChange(e)
	{
		this.premiumJson=[];
		console.log(this.premiumJson)
		if(e.target.checked){
			this.quoteJson.zero_dep=1;
			this.zeroDepBool=true;
		}
		else
		{
			this.quoteJson.zero_dep=0;
			this.zeroDepBool=false;
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
			console.log(this.premiumJson)
		});
	} */
	zeroDepChange(e)
	{
		if(e.target.checked){
			this.quoteJson.zero_dep=1;
			this.zeroDepBool=true;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_ZERO_DEPT_PREM!="Not Available")
					{
						item.NET_PREMIUM=parseFloat(item.NET_PREMIUM)+parseFloat(item.NUM_ZERO_DEPT_PREM);
						item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
						item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
					}
					
				});
			});
		}
		else
		{
			this.quoteJson.zero_dep=0;
			this.zeroDepBool=false;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_ZERO_DEPT_PREM!="Not Available")
					{
						item.NET_PREMIUM=item.NET_PREMIUM-item.NUM_ZERO_DEPT_PREM;
						item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
						item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
					}
					
				});
			});
			
		}
	}
/* 	paOwnerChange(e)
	{
		this.premiumJson=[];
		if(e.target.checked){
			this.quoteJson.pa_owner=1;
			this.paOwnerBool=true;
		}
		else
		{
			this.quoteJson.pa_owner=0;
			this.paOwnerBool=false;
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
		});
	} */
	paOwnerChange(e)
	{
		if(e.target.checked){
			this.quoteJson.pa_owner=1;
			this.paOwnerBool=true;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_PA_TO_OWNER_DRIVER!="Not Available")
					{
						if(item.PROVIDER_ID =='2') //PA Owner Driver is mandatory for BAJAJ & HDFC 
						{
							
						}
						else
						{
							item.NET_PREMIUM=parseFloat(item.NET_PREMIUM)+parseFloat(item.NUM_PA_TO_OWNER_DRIVER);
							item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
							item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
						}		
					}
					
				});
			});
		}
		else
		{
			this.quoteJson.pa_owner=0;
			this.paOwnerBool=false;
			this.premiumJson.forEach(el => {
				el.forEach(item => {
					if(item.NUM_PA_TO_OWNER_DRIVER!="Not Available")
					{
						if(item.PROVIDER_ID =='2') //PA Owner Driver is mandatory for BAJAJ & HDFC 
						{
							console.log('');
						}
						else
						{
							item.NET_PREMIUM=item.NET_PREMIUM-item.NUM_PA_TO_OWNER_DRIVER;
							item.SERVICE_TAX = Math.round(item.NET_PREMIUM*.18)
							item.TOTAL_PREMIUM = item.NET_PREMIUM+item.SERVICE_TAX;
						}
					}
					
				});
			});
		}
		
		console.log(this.premiumJson);
		
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {});
		
	}	
	
	/***********************************************************************************************************************/
													//Premium Api Service Call
	/***********************************************************************************************************************/
	
	
	storePremium()
	{
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_SUBMIT&PREMIUM_TYPE="+this.form_premium_type;
		let quoteID;
		let userCode=0;
		let obj =this;
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			quoteID=data;
			if(quoteID!="" && typeof quoteID !== 'undefined')
			{
				this.localStorage.setItem('quoteID', quoteID).subscribe(() => {
					console.log(quoteID);
				});
			}
		});
		
		
	}
	
	hdfcGetPremium()
	{
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=1&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		
		if(this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV!='0')
		{
			this.quoteJson.idv=this.minHdfcIDV;
		}
		else if(this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV!='0')
		{
			this.quoteJson.idv=this.maxHdfcIDV;
		}
		else
		{
			this.quoteJson.idv=this.modifyIDV;
		}
		
		
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
			
		});
		
	}
	relianceGetPremium()
	{
		
		this.quoteJson.serviceUrl=this.APIURL+"service.php?action=PREMIUM_REQUEST&PROVIDER_ID=12&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		
		if(this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV!='0')
		{
			this.quoteJson.idv=this.minRelianceIDV;
		}
		else if(this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV!='0')
		{
			this.quoteJson.idv=this.maxRelianceIDV;
		}
		else
		{
			this.quoteJson.idv=this.modifyIDV;
		}
		
		
		console.log(this.quoteJson);
		
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			this.parsePremiumJson(primiumString);
		});
		
	}
	
	
	/***********************************************************************************************************************/
													//IDV, Max IDV, Min IDV setup
	/***********************************************************************************************************************/
	
	parsePremiumJson(primiumString)
	{
		if(primiumString!="" && typeof primiumString !== 'undefined')
		{
			let premiumJson=JSON.parse(primiumString);
			
/* 			if(premiumJson[0].PROVIDER_ID=='12')
			{
				this.relianceParseJson(primiumString);
			} */
			 if(premiumJson[0].PROVIDER_ID=='1')
			{
				this.hdfcParseJson(primiumString);
			}
			
			premiumJson.forEach(el => {
				if(this.minIDV==0 && el.idv_amount_min!="")
				{
					this.minIDV=el.idv_amount_min;
				}
				else
				{
					
					if(el.idv_amount_min <= this.minIDV && el.idv_amount_min!="")
					{
						this.minIDV=el.idv_amount_min;
					}
				}
				
				if(this.maxIDV==0 && el.idv_amount_max!="")
				{
					this.maxIDV=el.idv_amount_max;
				}
				else
				{
					if(el.idv_amount_max >= this.maxIDV && el.idv_amount_max!="")
					{
						this.maxIDV=el.idv_amount_max;
					}
				}
			});
			
			
			this.countResultPremium++;
			this.premiumJson.push(premiumJson);
			this.showPremiumData=true;
			
			if(this.quoteJson.idv==0)
			{
				this.quoteModifyLeftForm.patchValue({"modifyIDV":this.minIDV}); //IF MODIFY IDV NOT SUBMITTED MIN VALUE WILL BE SET
			}
			else
			{
				this.quoteModifyLeftForm.patchValue({"modifyIDV":this.modifyIDV});
			}
		}
	}
	
	relianceParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minRelianceIDV==0)
			{
				this.minRelianceIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minRelianceIDV && el.idv_amount_min!="")
				{
					this.minRelianceIDV=el.idv_amount_min;
				}
			}
			if(this.maxRelianceIDV==0)
			{
				this.maxRelianceIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxRelianceIDV)
				{
					this.maxRelianceIDV=el.idv_amount_max;
				}
			}
		});
	}
	hdfcParseJson(primiumString)
	{
		let premiumJson=JSON.parse(primiumString);
		premiumJson.forEach(el => {
			if(this.minHdfcIDV==0)
			{
				this.minHdfcIDV=el.idv_amount_min;
			}
			else
			{
				if(el.idv_amount_min <= this.minHdfcIDV)
				{
					this.minHdfcIDV=el.idv_amount_min;
				}
			}
			if(this.maxHdfcIDV==0)
			{
				this.maxHdfcIDV=el.idv_amount_max;
			}
			else
			{
				if(el.idv_amount_max >= this.maxHdfcIDV)
				{
					this.maxHdfcIDV=el.idv_amount_max;
				}
			}
		});
	}
	/***********************************************************************************************************************/
													//IDV, Max IDV, Min IDV setup
	/***********************************************************************************************************************/
	
	
	/***********************************************************************************************************************/
													//Trigger premium button
	/***********************************************************************************************************************/
	
	
	
	premiumTapped(providerID,premiumitem)
	{
		premiumitem.carAccessories=this.quoteModifyLeftForm.get('carAccessories').value==null?'0':this.quoteModifyLeftForm.get('carAccessories').value;
		premiumitem.nonElectricalAccessories=this.quoteModifyLeftForm.get('nonElectricalAccessories').value==null?'0':this.quoteModifyLeftForm.get('nonElectricalAccessories').value;
		premiumitem.cngLpgKit=this.quoteModifyLeftForm.get('cngLpgKit').value==null?'0':this.quoteModifyLeftForm.get('cngLpgKit').value;
		console.log(premiumitem)
		if(providerID=="1")
		{
			this.localStorage.setItem('premiumJson', premiumitem).subscribe(() => {
				this.router.navigate(['/proposal']);
			});
		}
	}

}

