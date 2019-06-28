import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse  } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	
	//NODE_URL  =  'http://67.211.45.49:8009/action';
	NODE_URL  =  'http://192.168.7.127:3000/action';
	
	constructor(private  httpClient:  HttpClient) { }
	getPremium(quoteJson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,quoteJson);
		
	}
	sendSmsEmail(formJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,formJson);
	}
	createProposal(proposalJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,proposalJson);
		
	}
	storeProposal(proposalJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,proposalJson);
		
	}
	updatePayment(paymentJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,paymentJson);
		
	}
	call_me_back_submit(callbackjson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,callbackjson);
	}
	searchBrand(data){
		const NODE_URL2  =  'http://192.168.7.127:3000/brands';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(NODE_URL2,data);
	}
	signIn(callbackjson){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL,callbackjson);
	}
	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('user_json');
	  }
	  isAuthenticated() {
		let token = localStorage.getItem('user_json');
		return token != null;
	  }
}
