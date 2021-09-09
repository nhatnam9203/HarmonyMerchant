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
  func onDeviceReady()
  func onConfirmPayment()
  func printInProcess()
  func printDone(message: String)
  func deviceDisconnected()
}
@objc public class  CloverManager : DefaultCloverConnectorListener, PairingDeviceConfiguration {

  var myCloverConnector:ICloverConnector?
  var confirmPaymentRequest: ConfirmPaymentRequest?
  public var printJobStatusDict = [String : (PrintJobStatusResponse) -> Void]()
  fileprivate var token:String?
  @objc public var cloverDelegate: CloverManagerDelegate?
  var printers: [CLVModels.Printer.Printer]?

  fileprivate let PAIRING_AUTH_TOKEN_KEY:String = "PAIRING_AUTH_TOKEN"

  @objc public func connect(_ url:String, appId: String, appName: String, posSerial: String, token: String) {
        myCloverConnector?.dispose()
        // load from previous pairing, or nil will force/require
        // a new pairing with the device
      
      let config = WebSocketDeviceConfiguration(endpoint: url,
          remoteApplicationID: appId,
          posName: appName, posSerial: posSerial,
          pairingAuthToken: token.isEmpty ? nil : token,
          pairingDeviceConfiguration: self)

      myCloverConnector = CloverConnectorFactory.createICloverConnector(config: config)
      myCloverConnector?.addCloverConnectorListener(self)
      myCloverConnector?.initializeConnection()
    }

  @objc public func doSale(paymentInfo: NSDictionary) {
    // if onDeviceReady has been called
    let amount = Int(paymentInfo.value(forKey: "amount") as! String) ?? 0
    let externalId = paymentInfo.value(forKey: "externalId") as! String
    let tipModeString = paymentInfo.value(forKey: "tipMode") as! String
    
    let saleRequest = SaleRequest(amount: amount, externalId: externalId)
    
    // configure other properties of SaleRequest
    saleRequest.tipMode = SaleRequest.TipMode(rawValue: tipModeString)
    saleRequest.autoAcceptSignature = true
    
    myCloverConnector?.sale(saleRequest)
  }
  
  @objc public func doPrint(image: UIImage) {
    
//    let url = URL.init(fileURLWithPath: imageURI)
//
//    let _ = url.startAccessingSecurityScopedResource();
//    let imageData:NSData = NSData(contentsOf: url)
//
//    let image = UIImage(data: imageData as Data)
//    let _ = url.stopAccessingSecurityScopedResource()
    
      let request = PrintRequest(image: image, printRequestId: "\(arc4random())", printDeviceId: nil)
      self.issuePrintJob(request)
   
  }
  
  @objc public func confirmPayment() {
    myCloverConnector?.acceptPayment((self.confirmPaymentRequest?.payment)!)
  }
  
  @objc public func rejectPayment() {
    myCloverConnector?.rejectPayment((self.confirmPaymentRequest?.payment)!, challenge: (self.confirmPaymentRequest?.challenges![0])!)
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
      if(cloverDelegate != nil){
        cloverDelegate?.pairingSuccess(token: authToken)
      }
    }
  
  //*---------Print----------*//
  
  func retrievePrinters(completion: ((_ response:RetrievePrintersResponse) -> Void)?) {
      let request = RetrievePrintersRequest(printerCategory: nil)
      myCloverConnector?.retrievePrinters(request)
  }
  
  public override func onRetrievePrintersResponse(_ retrievePrintersResponse: RetrievePrintersResponse) {
      guard retrievePrintersResponse.success == true else {
          
        if(self.cloverDelegate != nil){
          self.cloverDelegate?.printDone(message: "Error retrieving printers")
        }
          return
      }
      
      if let printerList = retrievePrintersResponse.printers {
        if (printerList.count > 0) {
          self.printers = printerList
        }
      }
      
  }
  
  /// Private wrapper around print call that issues the request, configures the app and UI for printing, and sets up a callback for status
  ///
  /// - Parameter request: PrintRequest object containing the information needed to begin a print job
  private func issuePrintJob(_ request: PrintRequest) {
          //kick off the print request
         myCloverConnector?.print(request)
          
          //the rest of this scope works to monitor the print job. This can only be done if a printRequestID exists
          guard let printRequestId = request.printRequestId else { return }
          
          //setup the UI for async waiting on the print job
          if(cloverDelegate != nil){
            cloverDelegate?.printInProcess()
          }
          
          self.queryPrintStatus(printRequestId)
  }
  
  private func queryPrintStatus(_ printRequestId: String) {
      //this closure is kept on the listener, catches the first status update for this printRequestId (after it hits the Mini's printer spool), and then polls until the print job is done
    self.printJobStatusDict[printRequestId] = { [weak self] (response:PrintJobStatusResponse) -> Void in
          DispatchQueue.main.async {
              if response.status == .IN_QUEUE || response.status == .PRINTING { //since we're not done, perform another query after a short delay
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: {
                    let request = PrintJobStatusRequest(printRequestId)
                    self?.myCloverConnector?.retrievePrintJobStatus(request)
                  })
              } else {
                  UIApplication.shared.isIdleTimerDisabled = false
                  self?.printJobStatusDict.removeValue(forKey: printRequestId)
              }
          }
      }
  }
  
  public override func onPrintJobStatusResponse(_ printJobStatusResponse:PrintJobStatusResponse) {
      DispatchQueue.main.async {
          if let printRequestId = printJobStatusResponse.printRequestId, let callback = self.printJobStatusDict[printRequestId] { //check that we have a callback for this specific printRequestId
              callback(printJobStatusResponse)
              return //since user has provided their own callback to handle this, don't also continue below to fire the default behavior
          }
          
          if(self.cloverDelegate != nil){
            self.cloverDelegate?.printDone(message: printJobStatusResponse.status.rawValue)
          }
      }
  }

    // DefaultCloverConnectorListener

    // called when device is disconnected
  public override func onDeviceDisconnected() {
    if(self.cloverDelegate != nil){
      self.cloverDelegate?.deviceDisconnected()
    }
  }

    // called when device is connected, but not ready for requests
  public override func onDeviceConnected() {}

    // called when device is ready to take requests. Note: May be called more than once
  public override func onDeviceReady(_ info:MerchantInfo){
    if(cloverDelegate != nil){
      cloverDelegate?.onDeviceReady()
    }
  }

    // required if Mini wants the POS to verify a signature
  public override func onVerifySignatureRequest(_ signatureVerifyRequest: VerifySignatureRequest) {
        //present signature to user, then
        // acceptSignature(...) or rejectSignature(...)
    myCloverConnector?.acceptSignature(signatureVerifyRequest)
  }

    // required if Mini wants the POS to verify a payment
  public override func onConfirmPaymentRequest(_ request: ConfirmPaymentRequest) {
        //present 1 or more challenges to user, then
//        myCloverConnector?.acceptPayment(request.payment!)
        // or
        // myCloverConnector?.rejectPayment(...)
    self.confirmPaymentRequest = request
    if (cloverDelegate != nil) {
      cloverDelegate?.onConfirmPayment()
    }
  }

    // override other callback methods
  public override func onSaleResponse(_ response:SaleResponse) {
    
        if response.success {
            // sale successful and payment is in the response (response.payment)
          let responseDict: NSDictionary = ["id": response.payment?.id ?? "",
          // The order with which the payment is associated
          "orderId": response.payment?.order?.id ?? "",

          /// Device which processed the transaction for this payment
            "device": response.payment?.device ?? "",

          /// The tender type associated with this payment, e.g. credit card, cash, etc.
            "tender": response.payment?.tender?.label ?? "",

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
          "paymentRef": response.payment?.cardTransaction?.paymentRef ?? "",
          "creditRef": response.payment?.cardTransaction?.creditRef ?? "",
          "cardType": response.payment?.cardTransaction?.cardType ?? "",
          "entryType": response.payment?.cardTransaction?.entryType ?? "",
          "first6": response.payment?.cardTransaction?.first6 ?? "",
          "last4": response.payment?.cardTransaction?.last4 ?? "",
          "type_": response.payment?.cardTransaction?.type_ ?? "",
          "authCode": response.payment?.cardTransaction?.authCode ?? "",
          "referenceId": response.payment?.cardTransaction?.referenceId ?? "",
          "transactionNo": response.payment?.cardTransaction?.transactionNo ?? "",
          "state": response.payment?.cardTransaction?.state ?? "",
          "cardholderName": response.payment?.cardTransaction?.cardholderName ?? "",
          "token": response.payment?.cardTransaction?.token ?? "",
          "expirationDate": response.payment?.cardTransaction?.vaultedCard?.expirationDate ?? "",
          
                              
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
            var errorMessage = ""
            if response.result == .CANCEL {
              errorMessage = "Sale Canceled"
            } else if response.result == .FAIL {
              errorMessage = "Sale Failed"
            } else {
              errorMessage = response.result.rawValue
            }
            cloverDelegate?.paymentFail(errorMessage: errorMessage)
        }
    
      myCloverConnector?.showWelcomeScreen()
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
