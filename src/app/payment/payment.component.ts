import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/auth.service';
import { CommonService } from '../shared/services/common.service';
import { PaymentService } from './payment.service';

declare const Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  reportPricingOptions: any = {};
  documentPricingOptions: any = {};
  chatPricingOptions: any = {};

  selectedReportPlan: any;
  selectedDocumentPlan: any;
  selectedChatPlan: any;

  razorpay: any;
  orderId: string = ""; // Variable to store the order ID obtained from the backend

  constructor(
    private paymentService: PaymentService,
    public authService: AuthService,
    private commonService: CommonService
  ) {
    this.getPrices();
  }

  initiatePayment() {

    const amount = this.selectedReportPlan?.price + this.selectedDocumentPlan?.price + this.selectedChatPlan?.price;
    const currency_code = this.selectedReportPlan?.currency_code;

    // Create the order when the user initiates payment
    this.paymentService.createOrder(amount).subscribe(
      (response: any) => {
        this.orderId = response.data.order_id;
        this.initiateRazorpayCheckout(amount, currency_code); // Call the function to initiate Razorpay checkout
      },
      (error: any) => {
        console.error('Failed to create order:', error);
        this.commonService.showSnackbar("snackbar-error", error.message, error.status);
      }
    );
  }

  initiateRazorpayCheckout(amount: number, currency_code: string) {
    this.razorpay = new Razorpay({
      key: environment.razorpay_key, // Replace with your actual Razorpay Key ID
      amount: amount * 100, // Amount in paise
      currency: currency_code,
      name: 'TexplicitRW',
      description: 'Payment for TexplicitRW',
      order_id: this.orderId, // Pass the order ID obtained from backend
      handler: (response: any) => {
        // Handle the success callback from Razorpay
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount,
          currency: currency_code
        };

        // Capture the payment on the backend
        this.paymentService.capturePayment(paymentData).subscribe(
          (captureResponse: any) => {
            console.log('Payment captured successfully:', captureResponse);
            this.commonService.showSnackbar("snackbar-success", captureResponse.message, captureResponse.status);
          },
          (error: any) => {
            console.error('Failed to capture payment:', error);
            this.commonService.showSnackbar("snackbar-error", error.message, error.status);
          }
        );
      },
      theme: {
        color: '#171d5e',
        hide_topbar: true
      }
    });

    // Open Razorpay checkout modal when initialized
    this.razorpay.open();
  }

  getPrices() {
    this.paymentService.getPrices().subscribe({
      next: (res) => {
        // Extract the different pricing options
        this.reportPricingOptions = res?.data.filter((data: any) => data.category === "Report Pricing")[0];
        this.documentPricingOptions = res?.data.filter((data: any) => data.category === "Document Pricing")[0];
        this.chatPricingOptions = res?.data.filter((data: any) => data.category === "Chat Pricing")[0];

        // Set the initial selection for plans
        this.selectedReportPlan = this.reportPricingOptions?.plans[0];
        this.selectedDocumentPlan = this.documentPricingOptions?.plans[0];
        this.selectedChatPlan = this.chatPricingOptions?.plans[0];
      },
      error: (e) => {
        console.log("Error", e);
      },
      complete: () => {
        console.log("Completed fetching prices");
      }
    });
  }

}
