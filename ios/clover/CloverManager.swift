//
//  CloverSwift.swift
//  Hpmerchant_Production
//
//  Created by Duyen Hang on 28/07/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

import Foundation

@objc public protocol CloverManagerDelegate {
  func paymentSuccess(response: NSDictionary)
  func paymentFail(errorMessage: String)
  func pairingCode(string: String)
  func pairingSuccess(token: String)
}
@objc public class  CloverManager : DefaultCloverConnectorListener, PairingDeviceConfiguration {

  var myCloverConnector:ICloverConnector?
  fileprivate var token:String?
  @objc public var cloverDelegate: CloverManagerDelegate?

  fileprivate let PAIRING_AUTH_TOKEN_KEY:String = "PAIRING_AUTH_TOKEN"

  @objc public func connect(_ url:String, appId: String, appName: String, posSerial: String) {
        myCloverConnector?.dispose()
        // load from previous pairing, or nil will force/require
        // a new pairing with the device
        let savedAuthToken = loadAuthToken()

   
        let config = WebSocketDeviceConfiguration(endpoint: url,
            remoteApplicationID: appId,
            posName: appName, posSerial: posSerial,
            pairingAuthToken: savedAuthToken, pairingDeviceConfiguration: self)

        myCloverConnector = CloverConnectorFactory.createICloverConnector(config: config)
        myCloverConnector?.addCloverConnectorListener(self)
        myCloverConnector?.initializeConnection()
      
        
    }
  
  func test(){
    print("test")
  }

    func doSale(paymentInfo: NSDictionary) {
        // if onDeviceReady has been called
      let saleRequest = SaleRequest(amount: paymentInfo.value(forKey: "amount") as! Int, externalId: paymentInfo.value(forKey: "externalId") as! String)
        // configure other properties of SaleRequest
        myCloverConnector?.sale(saleRequest)
    }

    // store the token to be loaded later by loadAuthToken
    func saveAuthToken(token:String) {
      self.token = token
      UserDefaults.standard.set(self.token, forKey: PAIRING_AUTH_TOKEN_KEY)
      UserDefaults.standard.synchronize()
    }
    func loadAuthToken() -> String? {
      return UserDefaults.standard.string( forKey: PAIRING_AUTH_TOKEN_KEY)
    }


    // PairingDeviceConfiguration
  public func onPairingCode(_ pairingCode: String) {
        // display pairingCode to user, to be entered on the Clover Mini
    if(cloverDelegate != nil){
      cloverDelegate?.pairingCode(string: pairingCode)
    }
  }

  public func onPairingSuccess(_ authToken: String) {
        // pairing is successful
        // save this authToken to pass in to the config for future connections
        // so pairing will happen automatically
      saveAuthToken(token: authToken)
      if(cloverDelegate != nil){
        cloverDelegate?.pairingSuccess(token: authToken)
      }
    }


    // DefaultCloverConnectorListener

    // called when device is disconnected
  public override func onDeviceDisconnected() {}

    // called when device is connected, but not ready for requests
  public override func onDeviceConnected() {}

    // called when device is ready to take requests. Note: May be called more than once
  public override func onDeviceReady(_ info:MerchantInfo){}

    // required if Mini wants the POS to verify a signature
  public override func onVerifySignatureRequest(_ signatureVerifyRequest: VerifySignatureRequest) {
        //present signature to user, then
        // acceptSignature(...) or rejectSignature(...)
    }

    // required if Mini wants the POS to verify a payment
  public override func onConfirmPaymentRequest(_ request: ConfirmPaymentRequest) {
        //present 1 or more challenges to user, then
        myCloverConnector?.acceptPayment(request.payment!)
        // or
        // myCloverConnector?.rejectPayment(...)
    }

    // override other callback methods
  public override func onSaleResponse(_ response:SaleResponse) {
        if response.success {
            // sale successful and payment is in the response (response.payment)
          let responseDict: NSDictionary = ["id": response.payment?.id ?? "",
          // The order with which the payment is associated
            "order": response.payment?.order ?? "",

          /// Device which processed the transaction for this payment
            "device": response.payment?.device ?? "",

          /// The tender type associated with this payment, e.g. credit card, cash, etc.
            "tender": response.payment?.tender ?? "",

          /// Total amount paid
            "amount": response.payment?.amount ?? 0,

          /// Amount paid in tips
            "tipAmount": response.payment?.tipAmount ?? 0,

          /// Amount paid in tax
            "taxAmount": response.payment?.taxAmount ?? 0,

          /// Amount given back in a cash back transaction
            "cashbackAmount": response.payment?.cashbackAmount ?? 0,

          /// Amount of cash given by the customer
            "cashTendered": response.payment?.cashTendered ?? "",

            "externalPaymentId": response.payment?.externalPaymentId ?? "",
          
         // The employee who processed the payment
          "employee": response.payment?.employee ?? "",

          /// Time payment was recorded on server
          "createdTime": response.payment?.createdTime ?? "",

          "clientCreatedTime": response.payment?.clientCreatedTime ?? "",

          /// Last modified time of the payment
          "modifiedTime": response.payment?.modifiedTime ?? "",

          "offline": response.payment?.offline ?? "",

          "result": response.payment?.result ?? "",

          /// Information about the card used for credit/debit card payments
          "cardTransaction": response.payment?.cardTransaction ?? "",

          /// Amount record as a service charge
          "serviceCharge": response.payment?.serviceCharge ?? "",

          "taxRates": response.payment?.taxRates ?? "",

          "refunds": response.payment?.refunds ?? "",

          "note": response.payment?.note ?? "",

          "lineItemPayments": response.payment?.lineItemPayments ?? "",

          /// If voided, the reason why (when available)
          "voidReason": response.payment?.voidReason ?? "",

          /// Dynamic Currency Conversion information
          "dccInfo": response.payment?.dccInfo ?? "",

          /// Per transaction settings for the payment
          "transactionSettings": response.payment?.transactionSettings ?? "",

          /// German region-specific information
          "germanInfo": response.payment?.germanInfo ?? "",

          /// Tracking information for the app that created this payment.
          "appTracking": response.payment?.appTracking ?? "",

          /// Additional charges associated with this transaction (Canada INTERAC)
          "additionalCharges": response.payment?.additionalCharges ?? "",
          
          "transactionInfo": response.payment?.transactionInfo ?? "",
          
          "increments": response.payment?.increments ?? ""
          ]
          
          if(cloverDelegate != nil){
            cloverDelegate?.paymentSuccess(response: responseDict)
          }
        } else {
            // sale failed or was canceled
          cloverDelegate?.paymentFail(errorMessage: "Failed")
        }
    }

  public override func onAuthResponse(_ response:AuthResponse) {}
  public override func onPreAuthResponse(_ response:PreAuthResponse) {}

    // will provide UI information about the activity on the Mini,
    // and may provide input options for the POS to select some
    // options on behalf of the customer
  public override func onDeviceActivityStart(_ deviceEvent:CloverDeviceEvent){} // see CloverConnectorListener.swift for example of calling invokeInputOption from this callback
  public override func onDeviceActivityEnd(_ deviceEvent:CloverDeviceEvent){}
    // etc.
}
