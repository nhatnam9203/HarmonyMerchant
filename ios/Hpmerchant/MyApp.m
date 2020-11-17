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
#import "BatchRequest.h"
#import "BatchResponse.h"
#import "ReportRequest.h"
#import "ReportResponse.h"

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


- (void)cancelTransactionInternal
{

   MyApp *myapp = [MyApp sharedSigleton];
    [myapp.poslink cancelTrans];
}

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}



//--------- Test Javascript ---------
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cancelTransaction){
  
  MyApp *myapp = [MyApp sharedSigleton];
  [myapp.poslink cancelTrans];
}


RCT_EXPORT_METHOD(sendTransaction:(NSString *)tenderType amount:(NSString *)amount tipAmount:(NSString *)tipAmount callback:(RCTResponseSenderBlock)callback)
{
  MyApp *myapp = [MyApp sharedSigleton];
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  myapp.poslink.paymentRequest = paymentRequest;
  
 paymentRequest.TenderType = [PaymentRequest ParseTenderType:tenderType];
  paymentRequest.TransType = [PaymentRequest ParseTransType:@"SALE"];
  
  paymentRequest.Amount = amount;
  paymentRequest.CashBackAmt = @"";
  paymentRequest.ClerkID = @"";
   [self load];
   paymentRequest.SigSavePath = @"";
  [self saveInTabPayment];
  paymentRequest.Zip = @"";
  paymentRequest.TipAmt = tipAmount;
  paymentRequest.TaxAmt = @"";
  paymentRequest.FuelAmt = @"";
  paymentRequest.ECRTransID = @"";
  paymentRequest.Street1 = @"";
  paymentRequest.Street2 = @"";
  paymentRequest.SurchargeAmt = @"";
  paymentRequest.PONum = @"";
  paymentRequest.OrigRefNum = @"";
  paymentRequest.InvNum = @"";
  paymentRequest.ECRRefNum = @"1";
  paymentRequest.ECRTransID = @"";
  paymentRequest.AuthCode = @"";
  paymentRequest.ExtData = @"<TipRequest>1</TipRequest>";
  
  
  
  //  --------- Scan TCP ------
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    __weak typeof(self) weakSelf = self;
    myapp.poslink.reportedStatusChangeBlock = ^{
      statusCode = [myapp.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
        [weakSelf showReportStatus:statusCode];
      });
    };
    
    ProcessTransResult *ret = [myapp.poslink processTrans:PAYMENT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
        signData = myapp.poslink.paymentResponse.signData;
        
        if (myapp.poslink.paymentResponse.Message && myapp.poslink.paymentResponse.HostResponse ) {
          NSDictionary *dataSuccess = @{@"status":@true,
                                        @"ResultCode" : myapp.poslink.paymentResponse.ResultCode ? myapp.poslink.paymentResponse.ResultCode : @"",
                                        @"ResultTxt" : myapp.poslink.paymentResponse.ResultTxt ? myapp.poslink.paymentResponse.ResultTxt : @"",
                                        @"AuthCode" : myapp.poslink.paymentResponse.AuthCode ? myapp.poslink.paymentResponse.AuthCode : @"",
                                        @"ApprovedAmount" : myapp.poslink.paymentResponse.ApprovedAmount ? myapp.poslink.paymentResponse.ApprovedAmount : @"",
                                        @"AvsResponse" : myapp.poslink.paymentResponse.AvsResponse ? myapp.poslink.paymentResponse.AvsResponse : @"",
                                        @"BogusAccountNum" : myapp.poslink.paymentResponse.BogusAccountNum ? myapp.poslink.paymentResponse.BogusAccountNum : @"",
                                        @"CardType" : myapp.poslink.paymentResponse.CardType ? myapp.poslink.paymentResponse.CardType : @"",
                                        @"CvResponse" : myapp.poslink.paymentResponse.CvResponse ? myapp.poslink.paymentResponse.CvResponse : @"",
                                        @"HostCode" : myapp.poslink.paymentResponse.HostCode ? myapp.poslink.paymentResponse.HostCode : @"",
                                        @"HostResponse" : myapp.poslink.paymentResponse.HostResponse ?  myapp.poslink.paymentResponse.HostResponse : @"",
                                        @"RawResponse" : myapp.poslink.paymentResponse.RawResponse ?  myapp.poslink.paymentResponse.RawResponse : @"",
                                        @"Message" : myapp.poslink.paymentResponse.Message ? myapp.poslink.paymentResponse.Message : @"",
                                        @"RefNum" : myapp.poslink.paymentResponse.RefNum ? myapp.poslink.paymentResponse.RefNum : @"",
                                        @"RemainingBalance" : myapp.poslink.paymentResponse.RemainingBalance ? myapp.poslink.paymentResponse.RemainingBalance : @"",
                                        @"ExtraBalance" : myapp.poslink.paymentResponse.ExtraBalance ? myapp.poslink.paymentResponse.ExtraBalance : @"",
                                        @"Timestamp" : myapp.poslink.paymentResponse.Timestamp ?  myapp.poslink.paymentResponse.Timestamp : @"",
                                        @"InvNum" : myapp.poslink.paymentResponse.InvNum ? myapp.poslink.paymentResponse.InvNum : @"",
                                        @"ExtData" : myapp.poslink.paymentResponse.ExtData ? myapp.poslink.paymentResponse.ExtData : @"",
                                        @"RequestedAmount" : myapp.poslink.paymentResponse.RequestedAmount ? myapp.poslink.paymentResponse.RequestedAmount : @"",
                                        };
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          callback(@[result]);
          return;
        }
        
        
        if (signData != nil) {
          NSString *str = [myapp.poslink.paymentResponse.Timestamp stringByAppendingFormat:@"_%@",myapp.poslink.paymentResponse.RefNum];
          [myapp.poslink.paymentRequest saveSigData:signData fileName:str];
          [myapp.poslink.paymentRequest saveSigToPic:[PaymentRequest convertSigToPic:signData]  type:@".PNG" outFile:str];
        }
        
      }else {
        NSDictionary *dataError = @{@"status":@false,
                                    @"message":ret.msg
                                      };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
        callback(@[resultError]);
        return;
      }
      
//      ------------- ABORTED ----------------------
      NSDictionary *dataError = @{@"status":@false,
                                  @"message":@"ABORTED"
                                    };
       NSString  *resultError =  [self convertObjectToJson:dataError ] ;
      callback(@[resultError]);
      
    });
  });
}

RCT_EXPORT_METHOD(setupPax:(NSString *)destIp portDevice:(NSString *)portDevice timeoutConnect:(NSString *)timeoutConnect)
{
  MyApp *myapp = [MyApp sharedSigleton];
  myapp.poslink.commSetting.commType = @"TCP";
  myapp.poslink.commSetting.destIP = destIp;
  myapp.poslink.commSetting.destPort = portDevice;
  myapp.poslink.commSetting.timeout = timeoutConnect;
  
   [self save];
}

//---------------- Handle Batch -------------

RCT_EXPORT_METHOD(batchTransaction:(RCTResponseSenderBlock)callback)
{
  MyApp *myapp = [MyApp sharedSigleton];
  
  BatchRequest *batchRequest = [[BatchRequest alloc] init];
  
  batchRequest.TransType = [BatchRequest ParseTransType:@"BATCHCLOSE"];
  batchRequest.EDCType = [BatchRequest ParseEDCType:@"ALL"];
  batchRequest.PaymentType = [BatchRequest ParseTransType:@""];
  batchRequest.CardType = [BatchRequest ParseEDCType:@""];
  batchRequest.Timestamp = @"";
  batchRequest.SAFIndicator = @"";
  batchRequest.RecordNum = @"";
  batchRequest.RefNum = @"";
  batchRequest.AuthCode = @"";
  batchRequest.ECRRefNum = @"";
  batchRequest.ExtData = @"";
  
  myapp.poslink.batchRequest = batchRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    ProcessTransResult *ret = [myapp.poslink processTrans:BATCH];
    
     dispatch_async(dispatch_get_main_queue(), ^{
       
       if (ret.code == OK){
         
         NSDictionary *dataSuccess = @{@"status":@true,
                                       @"ResultCode" : myapp.poslink.batchResponse.ResultCode ? myapp.poslink.batchResponse.ResultCode : @"" ,
                                       @"ResultTxt" : myapp.poslink.batchResponse.ResultTxt ? myapp.poslink.batchResponse.ResultTxt : @"",
                                       @"CreditCount" :myapp.poslink.batchResponse.CreditCount ? myapp.poslink.batchResponse.CreditCount : @"",
                                       @"CreditAmount" :  myapp.poslink.batchResponse.CreditAmount ?  myapp.poslink.batchResponse.CreditAmount : @"",
                                       @"DebitCount" : myapp.poslink.batchResponse.DebitCount ?  myapp.poslink.batchResponse.DebitCount : @"",
                                       @"DebitAmount" : myapp.poslink.batchResponse.DebitAmount ? myapp.poslink.batchResponse.DebitAmount : @"",
                                       @"EBTCount" : myapp.poslink.batchResponse.EBTCount  ? myapp.poslink.batchResponse.EBTCount : @"",
                                       @"EBTAmount" : myapp.poslink.batchResponse.EBTAmount ? myapp.poslink.batchResponse.EBTAmount : @"" ,
                                       @"GiftCount" : myapp.poslink.batchResponse.GiftCount ? myapp.poslink.batchResponse.GiftCount : @"",
                                       @"GiftAmount" : myapp.poslink.batchResponse.GiftAmount ? myapp.poslink.batchResponse.GiftAmount : @"",
                                       @"LoyaltyCount" : myapp.poslink.batchResponse.LoyaltyCount ? myapp.poslink.batchResponse.LoyaltyCount : @"",
                                       @"LoyaltyAmount" :myapp.poslink.batchResponse.LoyaltyAmount ? myapp.poslink.batchResponse.LoyaltyAmount : @"",
                                       @"CashCount" : myapp.poslink.batchResponse.CashCount ? myapp.poslink.batchResponse.CashCount : @"",
                                       @"CashAmount" : myapp.poslink.batchResponse.CashAmount ?  myapp.poslink.batchResponse.CashAmount : @"",
                                       @"CHECKCount" : myapp.poslink.batchResponse.CHECKCount ? myapp.poslink.batchResponse.CHECKCount : @"",
                                       @"CHECKAmount" : myapp.poslink.batchResponse.CHECKAmount ? myapp.poslink.batchResponse.CHECKAmount : @"",
                                       @"Timestamp" : myapp.poslink.batchResponse.Timestamp ? myapp.poslink.batchResponse.Timestamp : @"",
                                       @"TID" :myapp.poslink.batchResponse.TID ? myapp.poslink.batchResponse.TID : @"",
                                       @"MID" : myapp.poslink.batchResponse.MID ? myapp.poslink.batchResponse.MID : @"",
                                       @"HostTraceNum" : myapp.poslink.batchResponse.HostTraceNum ?  myapp.poslink.batchResponse.HostTraceNum : @"",
                                       @"BatchNum" : myapp.poslink.batchResponse.BatchNum ? myapp.poslink.batchResponse.BatchNum : @"",
                                       @"AuthCode" : myapp.poslink.batchResponse.AuthCode ? myapp.poslink.batchResponse.AuthCode : @"",
                                       @"HostCode" : myapp.poslink.batchResponse.HostCode ? myapp.poslink.batchResponse.HostCode : @"",
                                       @"HostResponse" : myapp.poslink.batchResponse.HostResponse ? myapp.poslink.batchResponse.HostResponse : @"",
                                       @"Message" : myapp.poslink.batchResponse.Message ?  myapp.poslink.batchResponse.Message : @"",
                                       @"ExtData" : myapp.poslink.batchResponse.ExtData ?  myapp.poslink.batchResponse.ExtData : @"",
                                       @"BatchFailedRefNum" : myapp.poslink.batchResponse.BatchFailedRefNum ? myapp.poslink.batchResponse.BatchFailedRefNum : @"",
                                       @"BatchFailedCount" : myapp.poslink.batchResponse.BatchFailedCount ? myapp.poslink.batchResponse.BatchFailedCount : @"",
                                       @"SAFTotalCount" : myapp.poslink.batchResponse.SAFTotalCount ? myapp.poslink.batchResponse.SAFTotalCount : @"",
                                       @"SAFTotalAmount" : myapp.poslink.batchResponse.SAFTotalAmount ? myapp.poslink.batchResponse.SAFTotalAmount : @"",
                                       @"SAFUploadedCount" : myapp.poslink.batchResponse.SAFUploadedCount ?  myapp.poslink.batchResponse.SAFUploadedCount : @"",
                                       @"SAFUploadedAmount" : myapp.poslink.batchResponse.SAFUploadedAmount ? myapp.poslink.batchResponse.SAFUploadedAmount : @"",
                                       @"SAFFailedCount" : myapp.poslink.batchResponse.SAFFailedCount ? myapp.poslink.batchResponse.SAFFailedCount : @"",
                                       @"SAFFailedTotal" : myapp.poslink.batchResponse.SAFFailedTotal ? myapp.poslink.batchResponse.SAFFailedTotal : @"",
                                       @"SAFDeletedCount" : myapp.poslink.batchResponse.SAFDeletedCount ? myapp.poslink.batchResponse.SAFDeletedCount : @"",
                                       };
         
         NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
         callback(@[result]);
         
       }else {
         NSDictionary *dataError = @{@"status":@false,
                                     @"message":ret.msg
                                     };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
         callback(@[resultError]);
       }
       
     });
    
  });
}

//---------------- Handle Report -------------
RCT_EXPORT_METHOD(reportTransaction:(NSString *)transType edcType:(NSString *)edcType cardType:(NSString *)cardType paymentType:(NSString *)paymentType findEventsWithResolver:(RCTPromiseResolveBlock)resolve  rejecter:(RCTPromiseRejectBlock)reject)
//                  callback:(RCTResponseSenderBlock)callback
{
  MyApp *myapp = [MyApp sharedSigleton];
   ReportRequest *reportRequest = [[ReportRequest alloc] init];
  
   reportRequest.TransType = [ReportRequest ParseTransType:transType];
    reportRequest.EDCType = [ReportRequest ParseEDCType:edcType];
   reportRequest.CardType = [ReportRequest ParseCardType:cardType];
  reportRequest.PaymentType = [ReportRequest ParsePaymentType:paymentType];
  
  reportRequest.RecordNum = @"";
  reportRequest.RefNum = @"";
  reportRequest.AuthCode = @"";
  reportRequest.ECRRefNum = @"";
  reportRequest.SAFIndicator = @"";
  reportRequest.ExtData = @"";
  
  myapp.poslink.reportRequest = reportRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
     ProcessTransResult *ret = [myapp.poslink processTrans:REPORT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      
      
      
      if (ret.code == OK) {
        
        NSDictionary *dataSuccess = @{@"status":@true,
                                       @"ResultCode" : myapp.poslink.reportResponse.ResultCode ? myapp.poslink.reportResponse.ResultCode : @"" ,
                                       @"ResultTxt" : myapp.poslink.reportResponse.ResultTxt ? myapp.poslink.reportResponse.ResultTxt : @"" ,
//                                       @"EDCType" : myapp.poslink.reportResponse.EDCType ? myapp.poslink.reportResponse.EDCType : @"" ,
                                       @"TotalRecord" : myapp.poslink.reportResponse.TotalRecord ? myapp.poslink.reportResponse.TotalRecord : @"" ,
//                                       @"RecordNumber" : myapp.poslink.reportResponse.RecordNumber ? myapp.poslink.reportResponse.RecordNumber : @"" ,
//                                       @"PaymentType" : myapp.poslink.reportResponse.PaymentType ? myapp.poslink.reportResponse.PaymentType : @"" ,
//                                       @"OrigPaymentType" : myapp.poslink.reportResponse.OrigPaymentType ? myapp.poslink.reportResponse.OrigPaymentType : @"" ,
//                                       @"HostTraceNum" : myapp.poslink.reportResponse.HostTraceNum ? myapp.poslink.reportResponse.HostTraceNum : @"" ,
//                                       @"BatchNum" : myapp.poslink.reportResponse.BatchNum ? myapp.poslink.reportResponse.BatchNum : @"" ,
//                                       @"AuthCode" : myapp.poslink.reportResponse.AuthCode ? myapp.poslink.reportResponse.AuthCode : @"" ,
//                                       @"HostCode" : myapp.poslink.reportResponse.HostCode ? myapp.poslink.reportResponse.HostCode : @"" ,
//                                       @"HostResponse" : myapp.poslink.reportResponse.HostResponse ? myapp.poslink.reportResponse.HostResponse : @"" ,
                                       @"Message" : myapp.poslink.reportResponse.Message ? myapp.poslink.reportResponse.Message : @"" ,
                                       @"ApprovedAmount" : myapp.poslink.reportResponse.ApprovedAmount ? myapp.poslink.reportResponse.ApprovedAmount : @"" ,
//                                       @"RemainingBalance" : myapp.poslink.reportResponse.RemainingBalance ? myapp.poslink.reportResponse.RemainingBalance : @"" ,
//                                       @"ExtraBalance" : myapp.poslink.reportResponse.ExtraBalance ? myapp.poslink.reportResponse.ExtraBalance : @"" ,
//                                       @"BogusAccountNum" : myapp.poslink.reportResponse.BogusAccountNum ? myapp.poslink.reportResponse.BogusAccountNum : @"" ,
//                                       @"CardType" : myapp.poslink.reportResponse.CardType ? myapp.poslink.reportResponse.CardType : @"" ,
//                                       @"CvResponse" : myapp.poslink.reportResponse.CvResponse ? myapp.poslink.reportResponse.CvResponse : @"" ,
//                                       @"RefNum" : myapp.poslink.reportResponse.RefNum ? myapp.poslink.reportResponse.RefNum : @"" ,
//                                       @"ECRRefNum" : myapp.poslink.reportResponse.ECRRefNum ? myapp.poslink.reportResponse.ECRRefNum : @"" ,
//                                       @"Timestamp" : myapp.poslink.reportResponse.Timestamp ? myapp.poslink.reportResponse.Timestamp : @"" ,
//                                       @"ClerkID" : myapp.poslink.reportResponse.ClerkID ? myapp.poslink.reportResponse.ClerkID : @"" ,
//                                       @"ShiftID" : myapp.poslink.reportResponse.ShiftID ? myapp.poslink.reportResponse.ShiftID : @"" ,
//                                       @"ReportType" : myapp.poslink.reportResponse.ReportType ? myapp.poslink.reportResponse.ReportType : @"" ,
                                       @"CreditCount" : myapp.poslink.reportResponse.CreditCount ? myapp.poslink.reportResponse.CreditCount : @"" ,
                                       @"CreditAmount" : myapp.poslink.reportResponse.CreditAmount ? myapp.poslink.reportResponse.CreditAmount : @"" ,
//                                       @"DebitCount" : myapp.poslink.reportResponse.DebitCount ? myapp.poslink.reportResponse.DebitCount : @"" ,
//                                       @"DebitAmount" : myapp.poslink.reportResponse.DebitAmount ? myapp.poslink.reportResponse.DebitAmount : @"" ,
//                                       @"EBTCount" : myapp.poslink.reportResponse.EBTCount ? myapp.poslink.reportResponse.EBTCount : @"" ,
//                                       @"EBTAmount" : myapp.poslink.reportResponse.EBTAmount ? myapp.poslink.reportResponse.EBTAmount : @"" ,
//                                       @"GiftCount" : myapp.poslink.reportResponse.GiftCount ? myapp.poslink.reportResponse.GiftCount : @"" ,
//                                       @"GiftAmount" : myapp.poslink.reportResponse.GiftAmount ? myapp.poslink.reportResponse.GiftAmount : @"" ,
//                                       @"LoyaltyCount" : myapp.poslink.reportResponse.LoyaltyCount ? myapp.poslink.reportResponse.LoyaltyCount : @"" ,
//                                       @"LoyaltyAmount" : myapp.poslink.reportResponse.LoyaltyAmount ? myapp.poslink.reportResponse.LoyaltyAmount : @"" ,
//                                       @"CashCount" : myapp.poslink.reportResponse.CashCount ? myapp.poslink.reportResponse.CashCount : @"" ,
//                                       @"CashAmount" : myapp.poslink.reportResponse.CashAmount ? myapp.poslink.reportResponse.CashAmount : @"" ,
//                                       @"CHECKCount" : myapp.poslink.reportResponse.CHECKCount ? myapp.poslink.reportResponse.CHECKCount : @"" ,
//                                       @"CHECKAmount" : myapp.poslink.reportResponse.CHECKAmount ? myapp.poslink.reportResponse.CHECKAmount : @"" ,
                                       @"ExtData" : myapp.poslink.reportResponse.ExtData ? myapp.poslink.reportResponse.ExtData : @"" ,
//                                       @"VisaCount" : myapp.poslink.reportResponse.VisaCount ? myapp.poslink.reportResponse.VisaCount : @"" ,
//                                       @"VisaAmount" : myapp.poslink.reportResponse.VisaAmount ? myapp.poslink.reportResponse.VisaAmount : @"" ,
//                                       @"MasterCardCount" : myapp.poslink.reportResponse.MasterCardCount ? myapp.poslink.reportResponse.MasterCardCount : @"" ,
//                                       @"MasterCardAmount" : myapp.poslink.reportResponse.MasterCardAmount ? myapp.poslink.reportResponse.MasterCardAmount : @"" ,
//                                       @"AMEXCount" : myapp.poslink.reportResponse.AMEXCount ? myapp.poslink.reportResponse.AMEXCount : @"" ,
//                                       @"AMEXAmount" : myapp.poslink.reportResponse.AMEXAmount ? myapp.poslink.reportResponse.AMEXAmount : @"" ,
//                                       @"DinersCount" : myapp.poslink.reportResponse.DinersCount ? myapp.poslink.reportResponse.DinersCount : @"" ,
//                                       @"DinersAmount" : myapp.poslink.reportResponse.DinersAmount ? myapp.poslink.reportResponse.DinersAmount : @"" ,
//                                       @"DiscoverCount" : myapp.poslink.reportResponse.DiscoverCount ? myapp.poslink.reportResponse.DiscoverCount : @"" ,
//                                       @"DiscoverAmount" : myapp.poslink.reportResponse.DiscoverAmount ? myapp.poslink.reportResponse.DiscoverAmount : @"" ,
//                                       @"JCBCount" : myapp.poslink.reportResponse.JCBCount ? myapp.poslink.reportResponse.JCBCount : @"" ,
//                                       @"JCBAmount" : myapp.poslink.reportResponse.JCBAmount ? myapp.poslink.reportResponse.JCBAmount : @"" ,
//                                       @"enRouteCount" : myapp.poslink.reportResponse.enRouteCount ? myapp.poslink.reportResponse.enRouteCount : @"" ,
//                                       @"enRouteAmount" : myapp.poslink.reportResponse.enRouteAmount ? myapp.poslink.reportResponse.enRouteAmount : @"" ,
//                                       @"ExtendedCount" : myapp.poslink.reportResponse.ExtendedCount ? myapp.poslink.reportResponse.ExtendedCount : @"" ,
//                                       @"ExtendedAmount" : myapp.poslink.reportResponse.ExtendedAmount ? myapp.poslink.reportResponse.ExtendedAmount : @"" ,
//                                       @"VisaFleetCount" : myapp.poslink.reportResponse.VisaFleetCount ? myapp.poslink.reportResponse.VisaFleetCount : @"" ,
//                                      @"VisaFleetAmount" : myapp.poslink.reportResponse.VisaFleetAmount ? myapp.poslink.reportResponse.VisaFleetAmount : @"" ,
//                                      @"MasterCardFleetCount" : myapp.poslink.reportResponse.MasterCardFleetCount ? myapp.poslink.reportResponse.MasterCardFleetCount : @"" ,
//                                      @"MasterCardFleetAmount" : myapp.poslink.reportResponse.MasterCardFleetAmount ? myapp.poslink.reportResponse.MasterCardFleetAmount : @"" ,
//                                      @"FleetOneCount" : myapp.poslink.reportResponse.FleetOneCount ? myapp.poslink.reportResponse.FleetOneCount : @"" ,
//                                      @"FleetOneAmount" : myapp.poslink.reportResponse.FleetOneAmount ? myapp.poslink.reportResponse.FleetOneAmount : @"" ,
//                                      @"FleetwideCount" : myapp.poslink.reportResponse.FleetwideCount ? myapp.poslink.reportResponse.FleetwideCount : @"" ,
//                                      @"FleetwideAmount" : myapp.poslink.reportResponse.FleetwideAmount ? myapp.poslink.reportResponse.FleetwideAmount : @"" ,
//                                      @"FuelmanCount" : myapp.poslink.reportResponse.FuelmanCount ? myapp.poslink.reportResponse.FuelmanCount : @"" ,
//                                      @"FuelmanAmount" : myapp.poslink.reportResponse.FuelmanAmount ? myapp.poslink.reportResponse.FuelmanAmount : @"" ,
//                                      @"GascardCount" : myapp.poslink.reportResponse.GascardCount ? myapp.poslink.reportResponse.GascardCount : @"" ,
//                                      @"GascardAmount" : myapp.poslink.reportResponse.GascardAmount ? myapp.poslink.reportResponse.GascardAmount : @"" ,
//                                      @"VoyagerCount" : myapp.poslink.reportResponse.VoyagerCount ? myapp.poslink.reportResponse.VoyagerCount : @"" ,
//                                      @"VoyagerAmount" : myapp.poslink.reportResponse.VoyagerAmount ? myapp.poslink.reportResponse.VoyagerAmount : @"" ,
//                                      @"WrightExpressCount" : myapp.poslink.reportResponse.WrightExpressCount ? myapp.poslink.reportResponse.WrightExpressCount : @"" ,
//                                      @"WrightExpressAmount" : myapp.poslink.reportResponse.WrightExpressAmount ? myapp.poslink.reportResponse.WrightExpressAmount : @"" ,
//                                      @"InvNum" : myapp.poslink.reportResponse.InvNum ? myapp.poslink.reportResponse.InvNum : @"" ,
                                      
                                      };
        
        NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
//        callback(@[result]);
        resolve(@[result]);
        return;
        
      }else {
        NSDictionary *dataError = @{@"status":@false, @"message":ret.msg };
//        NSString  *resultError =  [self convertObjectToJson:dataError ] ;
//        callback(@[resultError]);
     
        NSString *domain = @"com.harmony.pos.paxError";
//        NSString *desc = NSLocalizedString(@"Unable to complete the process", @"");
//        NSDictionary *userInfo = @{ NSLocalizedDescriptionKey : desc };
        NSError *error = [NSError errorWithDomain:domain code:-101 userInfo:dataError];
        reject(@"no_events", ret.msg,error);
        return;
        
      }
      
    });
    
  });
}

//---------------- Handle Refund -------------
RCT_EXPORT_METHOD(refundTransaction:(NSString *)amount transactionId:(NSString *)transactionId extData:(NSString *)extData callback:(RCTResponseSenderBlock)callback)
{

 MyApp *myapp = [MyApp sharedSigleton];
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  myapp.poslink.paymentRequest = paymentRequest;
  
 paymentRequest.TenderType = [PaymentRequest ParseTenderType:@"CREDIT"];
  paymentRequest.TransType = [PaymentRequest ParseTransType:@"RETURN"];
  
  paymentRequest.Amount = amount;
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
  paymentRequest.ECRRefNum = transactionId;
  paymentRequest.ECRTransID = @"";
  paymentRequest.AuthCode = @"";
  paymentRequest.ExtData = extData;
  
  
  //  --------- Scan TCP ------
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    __weak typeof(self) weakSelf = self;
    myapp.poslink.reportedStatusChangeBlock = ^{
      statusCode = [myapp.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
        [weakSelf showReportStatus:statusCode];
      });
    };
    
    ProcessTransResult *ret = [myapp.poslink processTrans:PAYMENT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
        
        signData = myapp.poslink.paymentResponse.signData;
        
        if (myapp.poslink.paymentResponse.Message && myapp.poslink.paymentResponse.HostResponse ) {
          NSDictionary *dataSuccess = @{@"status":@true,
                                        @"ResultCode" : myapp.poslink.paymentResponse.ResultCode ? myapp.poslink.paymentResponse.ResultCode : @"",
                                        @"ResultTxt" : myapp.poslink.paymentResponse.ResultTxt ? myapp.poslink.paymentResponse.ResultTxt : @"",
                                        @"AuthCode" : myapp.poslink.paymentResponse.AuthCode ? myapp.poslink.paymentResponse.AuthCode : @"",
                                        @"ApprovedAmount" : myapp.poslink.paymentResponse.ApprovedAmount ? myapp.poslink.paymentResponse.ApprovedAmount : @"",
                                        @"AvsResponse" : myapp.poslink.paymentResponse.AvsResponse ? myapp.poslink.paymentResponse.AvsResponse : @"",
                                        @"BogusAccountNum" : myapp.poslink.paymentResponse.BogusAccountNum ? myapp.poslink.paymentResponse.BogusAccountNum : @"",
                                        @"CardType" : myapp.poslink.paymentResponse.CardType ? myapp.poslink.paymentResponse.CardType : @"",
                                        @"CvResponse" : myapp.poslink.paymentResponse.CvResponse ? myapp.poslink.paymentResponse.CvResponse : @"",
                                        @"HostCode" : myapp.poslink.paymentResponse.HostCode ? myapp.poslink.paymentResponse.HostCode : @"",
                                        @"HostResponse" : myapp.poslink.paymentResponse.HostResponse ?  myapp.poslink.paymentResponse.HostResponse : @"",
                                        @"Message" : myapp.poslink.paymentResponse.Message ? myapp.poslink.paymentResponse.Message : @"",
                                        @"RefNum" : myapp.poslink.paymentResponse.RefNum ? myapp.poslink.paymentResponse.RefNum : @"",
                                        @"RemainingBalance" : myapp.poslink.paymentResponse.RemainingBalance ? myapp.poslink.paymentResponse.RemainingBalance : @"",
                                        @"ExtraBalance" : myapp.poslink.paymentResponse.ExtraBalance ? myapp.poslink.paymentResponse.ExtraBalance : @"",
                                        @"Timestamp" : myapp.poslink.paymentResponse.Timestamp ?  myapp.poslink.paymentResponse.Timestamp : @"",
                                        @"InvNum" : myapp.poslink.paymentResponse.InvNum ? myapp.poslink.paymentResponse.InvNum : @"",
                                        @"ExtData" : myapp.poslink.paymentResponse.ExtData ? myapp.poslink.paymentResponse.ExtData : @"",
                                        @"RequestedAmount" : myapp.poslink.paymentResponse.RequestedAmount ? myapp.poslink.paymentResponse.RequestedAmount : @"",
                                        };
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          callback(@[result]);
          return;
        }
        
        
        if (signData != nil) {
          NSString *str = [myapp.poslink.paymentResponse.Timestamp stringByAppendingFormat:@"_%@",myapp.poslink.paymentResponse.RefNum];
          [myapp.poslink.paymentRequest saveSigData:signData fileName:str];
          [myapp.poslink.paymentRequest saveSigToPic:[PaymentRequest convertSigToPic:signData]  type:@".PNG" outFile:str];
        }
        
      }else {
        NSDictionary *dataError = @{@"status":@false,
                                    @"message":ret.msg
                                      };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
        callback(@[resultError]);
        return;
      }
      //      ------------- ABORTED ----------------------
      NSDictionary *dataError = @{@"status":@false,
                                  @"message":@"ABORTED"
                                    };
       NSString  *resultError =  [self convertObjectToJson:dataError ] ;
      callback(@[resultError]);
    });
    
  });
}

//---------------- Handle Void -------------
RCT_EXPORT_METHOD(voidTransaction:(NSString *)amount transactionId:(NSString *)transactionId extData:(NSString *)extData callback:(RCTResponseSenderBlock)callback)
{

 MyApp *myapp = [MyApp sharedSigleton];
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  myapp.poslink.paymentRequest = paymentRequest;
  
 paymentRequest.TenderType = [PaymentRequest ParseTenderType:@"CREDIT"];
  paymentRequest.TransType = [PaymentRequest ParseTransType:@"VOID"];
  
  paymentRequest.Amount = @"";
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
  paymentRequest.ECRRefNum = transactionId;
  paymentRequest.ECRTransID = @"";
  paymentRequest.AuthCode = @"";
  paymentRequest.ExtData =extData;
  
  //  --------- Scan TCP ------
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    __weak typeof(self) weakSelf = self;
    myapp.poslink.reportedStatusChangeBlock = ^{
      statusCode = [myapp.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
        [weakSelf showReportStatus:statusCode];
      });
    };
    
    ProcessTransResult *ret = [myapp.poslink processTrans:PAYMENT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
        signData = myapp.poslink.paymentResponse.signData;
        if (myapp.poslink.paymentResponse.Message && myapp.poslink.paymentResponse.HostResponse ) {
          NSDictionary *dataSuccess = @{@"status":@true,
                                        @"ResultCode" : myapp.poslink.paymentResponse.ResultCode ? myapp.poslink.paymentResponse.ResultCode : @"",
                                        @"ResultTxt" : myapp.poslink.paymentResponse.ResultTxt ? myapp.poslink.paymentResponse.ResultTxt : @"",
                                        @"AuthCode" : myapp.poslink.paymentResponse.AuthCode ? myapp.poslink.paymentResponse.AuthCode : @"",
                                        @"ApprovedAmount" : myapp.poslink.paymentResponse.ApprovedAmount ? myapp.poslink.paymentResponse.ApprovedAmount : @"",
                                        @"AvsResponse" : myapp.poslink.paymentResponse.AvsResponse ? myapp.poslink.paymentResponse.AvsResponse : @"",
                                        @"BogusAccountNum" : myapp.poslink.paymentResponse.BogusAccountNum ? myapp.poslink.paymentResponse.BogusAccountNum : @"",
                                        @"CardType" : myapp.poslink.paymentResponse.CardType ? myapp.poslink.paymentResponse.CardType : @"",
                                        @"CvResponse" : myapp.poslink.paymentResponse.CvResponse ? myapp.poslink.paymentResponse.CvResponse : @"",
                                        @"HostCode" : myapp.poslink.paymentResponse.HostCode ? myapp.poslink.paymentResponse.HostCode : @"",
                                        @"HostResponse" : myapp.poslink.paymentResponse.HostResponse ?  myapp.poslink.paymentResponse.HostResponse : @"",
                                        @"Message" : myapp.poslink.paymentResponse.Message ? myapp.poslink.paymentResponse.Message : @"",
                                        @"RefNum" : myapp.poslink.paymentResponse.RefNum ? myapp.poslink.paymentResponse.RefNum : @"",
                                        @"RemainingBalance" : myapp.poslink.paymentResponse.RemainingBalance ? myapp.poslink.paymentResponse.RemainingBalance : @"",
                                        @"ExtraBalance" : myapp.poslink.paymentResponse.ExtraBalance ? myapp.poslink.paymentResponse.ExtraBalance : @"",
                                        @"Timestamp" : myapp.poslink.paymentResponse.Timestamp ?  myapp.poslink.paymentResponse.Timestamp : @"",
                                        @"InvNum" : myapp.poslink.paymentResponse.InvNum ? myapp.poslink.paymentResponse.InvNum : @"",
                                        @"ExtData" : myapp.poslink.paymentResponse.ExtData ? myapp.poslink.paymentResponse.ExtData : @"",
                                        @"RequestedAmount" : myapp.poslink.paymentResponse.RequestedAmount ? myapp.poslink.paymentResponse.RequestedAmount : @"",
                                        };
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          callback(@[result]);
          return;
        }else {
            NSDictionary *dataSuccesButError = @{@"status":@false,
                                                   @"ResultCode" : myapp.poslink.paymentResponse.ResultCode ? myapp.poslink.paymentResponse.ResultCode : @"",
                                          @"message" : myapp.poslink.paymentResponse.ResultTxt ? myapp.poslink.paymentResponse.ResultTxt : @"",};
          
          NSString  *resultSuccesButError =  [self convertObjectToJson:dataSuccesButError ] ;
          callback(@[resultSuccesButError]);
        }
        
        if (signData != nil) {
          NSString *str = [myapp.poslink.paymentResponse.Timestamp stringByAppendingFormat:@"_%@",myapp.poslink.paymentResponse.RefNum];
          [myapp.poslink.paymentRequest saveSigData:signData fileName:str];
          [myapp.poslink.paymentRequest saveSigToPic:[PaymentRequest convertSigToPic:signData]  type:@".PNG" outFile:str];
        }
        
        
        
      }else {
        NSDictionary *dataError = @{@"status":@false,
                                    @"message":ret.msg
                                      };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
        callback(@[resultError]);

      }
      
    });
    
  });
}

@end
