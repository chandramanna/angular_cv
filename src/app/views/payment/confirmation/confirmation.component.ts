import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
	
	providerId: any="";
	transactionStatus: any="";
	transactionMsg: any="";
	policyNo: any="";
	transactionNo: any="";
	proposalNo: any="";
	paymentMethod: any="";
	orderStatus: any="";
	productCode: any="";
	premiumJson: any;
	paymentJson: any;
	showPremiumdata: boolean = false;
	//APIURL: string = "http://192.168.7.124/gibl-php/tw-services/";
	
	APIURL: string = "http://uat.gibl.in/tw-services/";
	constructor(private route:ActivatedRoute, private  apiService:  ApiService,protected localStorage: LocalStorage) { }

	ngOnInit() {
		this.getPremiumJson();
		this.route.params.subscribe(params => {
			this.providerId = params.id;
			if(this.providerId=="12")
			{
				this.reliancePaymentProcess();
			}
		});
	}
	getPremiumJson()
	{
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumJson=data;
			this.showPremiumdata=true;
		});
	}
	reliancePaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.transactionStatus = queryArr[3];
			this.transactionMsg = queryArr[6];
			this.policyNo = queryArr[1];
			this.transactionNo = queryArr[2];
			this.paymentMethod = queryArr[4];
			this.proposalNo = queryArr[5];
			
			if(this.transactionStatus=="0")
			{
				this.orderStatus = "1";
			}
			else
			{
				this.orderStatus = "2";
			}						
			this.paymentJson={
				"order_id":this.proposalNo,
				"policy_no":this.policyNo,
				"insurer_id":this.providerId,
				"payment_type":this.paymentMethod,
				"response_track_id":this.transactionNo,
				"order_status":this.orderStatus
			};
			this.paymentJson.serviceUrl=this.APIURL+"service.php?action=UPDATE_PAYMENT";
			this.apiService.updatePayment(this.paymentJson).subscribe(data => {
				console.log("Payment Updation Done");
			});
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			let premiumData=data;
			this.productCode = premiumData.PRODUCT_CODE;
			console.log(this.productCode);
		});
	}
}
