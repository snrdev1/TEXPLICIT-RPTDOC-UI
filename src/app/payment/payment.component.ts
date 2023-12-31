import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core/auth.service';
import { PaymentService } from './payment.service';
import { CommonService } from '../shared/services/common.service';

declare const Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  pricingOptions: any[] = [
    {
      "icon": "icon-pricing-onetime",
      "plan": "One Time Use",
      "description": "One set of all reports",
      "value": 4000
    },
    {
      "icon": "icon-pricing-limited",
      "plan": "Limited Use",
      "description": "Approx 11 sets",
      "value": 20000
    },
    {
      "icon": "icon-pricing-high",
      "plan": "Professional Use",
      "description": "Approx 24 sets",
      "value": 40000
    },
  ];

  razorpay: any;
  orderId: string = ""; // Variable to store the order ID obtained from the backend

  constructor(
    private paymentService: PaymentService,
    public authService: AuthService,
    private commonService: CommonService
  ) { }

  initiatePayment(pricingPlan: any) {
    // Create the order when the user initiates payment
    this.paymentService.createOrder(pricingPlan["value"]).subscribe(
      (response: any) => {
        this.orderId = response.data.order_id;
        this.initiateRazorpayCheckout(pricingPlan); // Call the function to initiate Razorpay checkout
      },
      (error: any) => {
        console.error('Failed to create order:', error);
        this.commonService.showSnackbar("snackbar-error", error.message, error.status);
      }
    );
  }

  initiateRazorpayCheckout(pricingPlan: any) {
    this.razorpay = new Razorpay({
      key: environment.razorpay_key, // Replace with your actual Razorpay Key ID
      amount: pricingPlan["value"] * 100, // Amount in paise
      currency: "INR",
      name: 'TexplicitRW',
      description: 'Payment for Texplicit plan : ' + pricingPlan["plan"],
      order_id: this.orderId, // Pass the order ID obtained from backend
      handler: (response: any) => {
        // Handle the success callback from Razorpay
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          amount: pricingPlan["value"],
          currency: "INR"
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
}
