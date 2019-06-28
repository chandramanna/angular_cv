import { Component, OnInit,ViewEncapsulation,ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-proposalconfirmationdisplay',
  templateUrl: './proposalconfirmationdisplay.component.html',
  styleUrls: ['../../../../assets/proposalconfirmation/css/style.css','../../../../assets/proposalconfirmation/css/main.css']
})
export class ProposalconfirmationdisplayComponent implements OnInit {

	quoteJson: any;
	premiumJson: any;
	proposalJson: any;
	personalDetailJson: any;
	carDetailJson: any;
	nomineeDetailJson: any;
	addressDetailJson: any;
	proposalConfirmationJson: any= {};
	showQuotedata: any;
	showPremiumdata: any;
	showProposaldata: any;
	showPaymentdata: any;
	paymentUrlHDFC: any;
	paymentUrlRELIANCE: any;
	responseUrlRELIANCE: any;
	errorContinueBuy: boolean = true;
	custId: any;
	paymentData:any= [];
	PaymentUrl: any;
	APIURL: string = "http://192.168.7.124/gibl-php/cv-services/";
	//APIURL: string = "http://uat.gibl.in/tw-services/";
	
	@ViewChild('hdfcSubmitBtn', { static: false }) hdfcSubmitBtn: ElementRef;
	@ViewChild('relianceSubmitBtn', { static: false }) relianceSubmitBtn: ElementRef;
	
	constructor(public formBuilder: FormBuilder, protected localStorage: LocalStorage, private router: Router, private  apiService:  ApiService) { 
		this.showQuotedata=false;
		this.showPremiumdata=false;
		this.showProposaldata=false;
		this.showPaymentdata=true;
		this.paymentUrlHDFC="http://202.191.196.210/uat/onlineproducts/twOnlinetariff/TIM.aspx";
		this.paymentUrlRELIANCE="http://rzonews.reliancegeneral.co.in:91/PaymentIntegration/PaymentIntegration";
		//this.responseUrlRELIANCE=window.location.origin+"/payment/confirmation/";
		this.responseUrlRELIANCE=window.location.origin+"/tw/payment/confirmation/";
		
		this.getQuoteJson();
	}
	getQuoteJson()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.showQuotedata=true;
			console.log(this.quoteJson);
			this.proposalConfirmationJson.quoteJson=this.quoteJson;
			this.getPremiumJson();
		});
	}
	getPremiumJson()
	{
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			var premium_json=data;
			this.premiumJson=premium_json;
			this.responseUrlRELIANCE=this.responseUrlRELIANCE+this.premiumJson.PROVIDER_ID;
			this.showPremiumdata=true;
			this.getProposalJson();
			this.proposalConfirmationJson.premiumJson=this.premiumJson;
			this.storeProposalJson();
			
			//console.log(this.premiumJson);
		});
	}
	storeProposalJson()
	{
		this.localStorage.getItem('quoteID').subscribe((data) => {
			let quoteID = data;
			this.proposalConfirmationJson.premiumJson.LAST_QUOTE_ID=quoteID;
			this.proposalConfirmationJson.serviceUrl=this.APIURL+"service.php?action=STORE_PROPOSAL";
			this.apiService.storeProposal(this.proposalConfirmationJson).subscribe(data => {
				let userCode=data;
				this.proposalConfirmationJson.premiumJson.userCode=userCode;
				console.log("Proposal Stored");
			});
		});
	}
	getProposalJson()
	{
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson=data;
			this.personalDetailJson=this.proposalJson.personalDetailForm;
			this.carDetailJson=this.proposalJson.carDetailForm;
			this.nomineeDetailJson=this.proposalJson.nomineeDetailForm;
			this.addressDetailJson=this.proposalJson.addressDetailForm;
			this.showProposaldata=true;
			this.proposalConfirmationJson.proposalJson=this.proposalJson;
			
			//console.log(this.proposalJson);
		});
	}
	createProposal()
	{
		if(this.errorContinueBuy)
		{
			this.showPaymentdata=false;
			this.localStorage.getItem('quoteID').subscribe((data) => {
				let quoteID = data;
				this.proposalConfirmationJson.premiumJson.LAST_QUOTE_ID=quoteID;
				this.proposalConfirmationJson.serviceUrl=this.APIURL+"service.php?action=CREATE_PROPOSAL&PROVIDER_ID="+this.premiumJson.PROVIDER_ID+"&PREMIUM_TYPE="+this.premiumJson.premium_type;
				
				console.log(this.proposalConfirmationJson);
				
				if(this.premiumJson.PROVIDER_ID=='1')
				{
					let obj =this.hdfcSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						let resData=data;
						let confirmationJSON : any;
						confirmationJSON=resData;
						this.paymentData=JSON.parse(confirmationJSON);
						console.log(this.paymentData.PaymentUrl)
						setInterval(function() {
							this.showPaymentdata=true;
							obj.nativeElement.click();
						},4000); 
						
					});
				}
				if(this.premiumJson.PROVIDER_ID=='12')
				{
					let obj = this.relianceSubmitBtn;
					this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
						this.custId=data;
						setInterval(function() {
							this.showPaymentdata=true;
							obj.nativeElement.click();
						},4000); 
					});
				}	
			});
		}
		
	}
	paymentFormSubmit(form: any, e: any): void
	{
		e.target.submit();
	}
	paymentFormSubmit1(form: any, e: any): void
	{
		e.target.submit();
	}
	termsCheckbox(event) {
		if ( event.target.checked ) {
			this.errorContinueBuy = true;
		}
		else
		{
			this.errorContinueBuy = false;
		}
	}
	ngOnInit() {
	}

}

