//
//  PosLink.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 8/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MyApp.h"
#import "CommSetting.h"
#import "PosLink.h"
#import "PaymentRequest.h"
#import "PaymentResponse.h"
#import "ProcessTransResult.h"

#define keyCommType @"commType"
#define keyTimeout @"timeout"
#define keySerialPort @"serialPort"
#define keyDestIP @"destIP"
#define keyDestPort @"destPort"
#define keyBluetoothAddr @"bluetoothAddr"
#define keySaveSigPath @"SigFilePath"

static NSString *signData;
static int statusCode;


@implementation MyApp

{
  CommSetting *commSetting;
}

@synthesize PaymentReqExtData;
@synthesize poslink;

+ (MyApp*) sharedSigleton
{
  static MyApp *myapp = nil;
  
  @synchronized (self) {
    if (myapp == nil)
    {
      myapp = [[MyApp alloc] init];
    }
    
    return myapp;
  }
}

- (id)init
{
  self = [super init];
  commSetting = [[CommSetting alloc]init];
  poslink = [[PosLink alloc]initWithCommSetting:commSetting];
  
  //init PaymentReqExtData
  NSArray *payReqExtDataNames = [NSArray arrayWithObjects:
                                 @"Account Information",
                                 @"Check Information",
                                 @"Trace Information",
                                 @"Cashier Information",
                                 @"Commercial Information",
                                 @"MOTO/E- Commercial Information",
                                 @"Additional Information",
                                 nil];
  NSArray *AccountInfoKeys = [NSArray arrayWithObjects:@"Account", @"ExpDate", @"CVV", @"EBTFoodStampVoucher", @"EBTType", @"VoucherNum",
                              @"Force", @"FirstName", @"LastName", @"CountryCode",
                              @"StateCode", @"CityName", @"EmailAddress", nil];
  NSArray *CheckInfoKeys = [NSArray arrayWithObjects:@"CheckSaleType", @"CheckRoutingNum", @"CheckNum",
                            @"CheckType", @"CheckIDType", @"CheckIDValue", @"Birth", @"PhoneNum", nil];
  NSArray *TraceInfoKeys = [NSArray arrayWithObjects:@"TimeStamp",@"OrigECRRefNum", nil];
  NSArray *CashierInfoKeys = [NSArray arrayWithObjects:@"ShiftID", nil];
  NSArray *CommercialInfoKeys = [NSArray arrayWithObjects:@"CustomerCode", @"TaxExempt", @"TaxExemptID",
                                 @"MerchantTaxID", @"DestinationZipCode", @"ProductDescription",
                                 @"LocalTax", @"NationalTax", @"CustomerTaxID",
                                 @"SummaryCommodityCode", @"DiscountAmt", @"FreightAmt",
                                 @"DutyAmt", @"ShipFromZipCode", @"VATInvoiceRefNum",
                                 @"OrderDate", @"VATTaxAmt", @"VATTaxRate", @"AlternateTaxAmt",
                                 @"AlternateTaxID", nil];
  NSArray *Moto_EComInfoKeys = [NSArray arrayWithObjects:@"MOTOECommerceMode", @"MOTOECommerceTransType", @"ECommerceSecureType",
                                @"MOTOECommerceOrderNumber", @"Installments", @"CurrentInstallment", nil];
  NSArray *AddiInfoKeys = [NSArray arrayWithObjects:@"TableNum", @"GuestNum", @"SignatureCapture", @"TicketNum",
                           @"HRefNum", @"TipRequest", @"SignUploadFlag", @"ReportStatus",
                           @"Token", @"TokenRequest", @"CardType", @"CardTypeBitmap",
                           @"PassthruData", @"ReturnReason", @"OrigTransDate", @"OrigPAN",
                           @"OrigExpiryDate", @"OrigTransTime", @"DisProgPrompts",
                           @"GatewayID", @"POSEchoData", @"GetSign", @"EntryModeBitmap",
                           @"ReceiptPrint", @"CPMode", @"FleetPromptCode", @"DebitNetwork",
                           @"Odometer", @"VehicleNo", @"JobNo", @"DriverID", @"EmployeeNo",
                           @"LicenseNo", @"JobID", @"DepartmentNo", @"CustomerData", @"UserID",
                           @"VehicleID", @"MM_ID", @"MM_Name", @"OrigSettlementDate",@"OrigTransType",@"StationNo",@"UserLanguage",@"AddLRspDataRequest",@"SurchargeFeeRequest",@"CustomizeData1",@"CustomizeData2",@"CustomizeData3",@"ForceCC",@"ForceFSA",nil];
  
  
  NSArray *InfoKeysArray = [NSArray arrayWithObjects:AccountInfoKeys, CheckInfoKeys, TraceInfoKeys, CashierInfoKeys, CommercialInfoKeys, Moto_EComInfoKeys, AddiInfoKeys, nil];
  
  self.PaymentReqExtData = [NSMutableArray array];
  for (int i = 0; i < [payReqExtDataNames count]; i ++)
  {
    [self.PaymentReqExtData setObject:[[ExtDataPaymentReq alloc] initWithName:payReqExtDataNames[i] Keys:InfoKeysArray[i]] atIndexedSubscript:i];
  }
  
  return self;
}

- (void)clearPaymentReqExtData
{
  for(ExtDataPaymentReq* extData in self.PaymentReqExtData)
  {
    [extData clearValues];
  }
}

- (void)save {
  
NSLog(@"Something To Print");
  
  NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
  MyApp *myapp = [MyApp sharedSigleton];
  [settings setObject:myapp.poslink.commSetting.commType forKey:keyCommType];
  [settings setObject:myapp.poslink.commSetting.timeout forKey:keyTimeout];
  [settings setObject:myapp.poslink.commSetting.serialPort forKey:keySerialPort];
  [settings setObject:myapp.poslink.commSetting.destIP forKey:keyDestIP];
  [settings setObject:myapp.poslink.commSetting.destPort forKey:keyDestPort];
  [settings setObject:myapp.poslink.commSetting.bluetoothAddr forKey:keyBluetoothAddr];
  
  [settings synchronize];
}

- (void)load {
  
  id idTemp;
  
  NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
  MyApp *myapp = [MyApp sharedSigleton];
  if ((idTemp = [settings objectForKey:keySaveSigPath]) != nil) {
    myapp.poslink.paymentRequest.SigSavePath = (NSString *)idTemp;
  }
}

- (void)saveInTabPayment {
  
  NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
 MyApp *myapp = [MyApp sharedSigleton];
  if (myapp.poslink.paymentRequest.SigSavePath != nil && myapp.poslink.paymentRequest.SigSavePath > 0){
    [settings setObject:myapp.poslink.paymentRequest.SigSavePath forKey:keySaveSigPath];
  }
}

- (void)showReportStatus:(int) number{
  
}

//--------- Test Javascript ---------
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(sendTransaction:(RCTResponseSenderBlock)callback)
{
  MyApp *myapp = [MyApp sharedSigleton];
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  myapp.poslink.paymentRequest = paymentRequest;
  
 paymentRequest.TenderType = [PaymentRequest ParseTenderType:@"CREDIT"];
   paymentRequest.TransType = [PaymentRequest ParseTransType:@"SALE"];
  
  paymentRequest.Amount = @"100";
  paymentRequest.CashBackAmt = @"";
  paymentRequest.ClerkID = @"";
   [self load];
   paymentRequest.SigSavePath = @"";
  [self saveInTabPayment];
  paymentRequest.Zip = @"";
  paymentRequest.TipAmt = @"";
  paymentRequest.TaxAmt = @"";
  paymentRequest.FuelAmt = @"";
  paymentRequest.ECRTransID = @"";
  paymentRequest.Street1 = @"";
  paymentRequest.Street2 = @"";
  paymentRequest.SurchargeAmt = @"";
  paymentRequest.PONum = @"";
  paymentRequest.OrigRefNum = @"";
  paymentRequest.InvNum = @"";
  paymentRequest.ECRRefNum = @"";
  paymentRequest.ECRTransID = @"";
  paymentRequest.AuthCode = @"";
  paymentRequest.ExtData = @"";
  
  
  
//  --------- Alert -------
  callback(@[@"sendTransaction"]);
  
}

RCT_EXPORT_METHOD(setupPax:(NSString *)destIp portDevice:(NSString *)portDevice timeoutConnect:(NSString *)timeoutConnect callback:(RCTResponseSenderBlock)callback)
{
  MyApp *myapp = [MyApp sharedSigleton];
  myapp.poslink.commSetting.commType = @"TCP";
  myapp.poslink.commSetting.destIP = destIp;
  myapp.poslink.commSetting.destPort = portDevice;
  myapp.poslink.commSetting.timeout = timeoutConnect;
  
   [self save];
  
  
//  --------- Scan TCP ------
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    __weak typeof(self) weakSelf = self;
    myapp.poslink.reportedStatusChangeBlock = ^{
      statusCode = [myapp.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
        [weakSelf showReportStatus:statusCode];
      });
//      NSLog(@"Terminal ReportedStatus = %zd",statusCode);
    };
    
    
    ProcessTransResult *ret = [myapp.poslink processTrans:PAYMENT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
//        [alert1 dismissWithClickedButtonIndex:0 animated:NO];
//        _ResultCode.text = self.myapp.poslink.paymentResponse.ResultCode;
//        _ResultText.text = self.myapp.poslink.paymentResponse.ResultTxt;
//        _RetAuthCode.text = self.myapp.poslink.paymentResponse.AuthCode;
//        _ApprovedAmt.text = self.myapp.poslink.paymentResponse.ApprovedAmount;
//        _AvsResponse.text = self.myapp.poslink.paymentResponse.AvsResponse;
//        _BogusAccountNum.text = self.myapp.poslink.paymentResponse.BogusAccountNum;
//        _CardType.text = self.myapp.poslink.paymentResponse.CardType;
//        _CvResponse.text = self.myapp.poslink.paymentResponse.CvResponse;
//        _HostCode.text = self.myapp.poslink.paymentResponse.HostCode;
//        _HostResponse.text = self.myapp.poslink.paymentResponse.HostResponse;
//        _Message.text = self.myapp.poslink.paymentResponse.Message;
//        _RefNum.text = self.myapp.poslink.paymentResponse.RefNum;
//        _RemainingBalance.text = self.myapp.poslink.paymentResponse.RemainingBalance;
//        _ExtraBalance.text = self.myapp.poslink.paymentResponse.ExtraBalance;
//        _RequestedAmt.text = self.myapp.poslink.paymentResponse.RequestedAmount;
//        _Timestamp.text = self.myapp.poslink.paymentResponse.Timestamp;
//        _ResInvNum.text = self.myapp.poslink.paymentResponse.InvNum;
//        _RetExtData.text = self.myapp.poslink.paymentResponse.ExtData;
        
        signData = myapp.poslink.paymentResponse.signData;
        
        if (signData != nil) {
          NSString *str = [myapp.poslink.paymentResponse.Timestamp stringByAppendingFormat:@"_%@",myapp.poslink.paymentResponse.RefNum];
//          _SigFileName.text = str;
          [myapp.poslink.paymentRequest saveSigData:signData fileName:str];
          [myapp.poslink.paymentRequest saveSigToPic:[PaymentRequest convertSigToPic:signData]  type:@".PNG" outFile:str];
        }
        
      }else if (ret.code == ERROR){
//        [alert1 dismissWithClickedButtonIndex:0 animated:NO];
//
//        alert = [[UIAlertView alloc] initWithTitle:@"ERROR" message:ret.msg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
//        [alert show];
      }else if(ret.code == TIMEOUT){
//        [alert1 dismissWithClickedButtonIndex:0 animated:NO];
//        
//        alert = [[UIAlertView alloc] initWithTitle:@"ERROR" message:ret.msg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
//        [alert show];
      }
    });
  });
  
  
  
//------ End scan TCP -------

// ----- Alert ------
  NSLog(@"%@-%@-%@", destIp,portDevice,timeoutConnect);
  callback(@[destIp]);
  
}

@end
