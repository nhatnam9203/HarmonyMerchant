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



- (void)clearPaymentReqExtData
{
  for(ExtDataPaymentReq* extData in self.PaymentReqExtData)
  {
    [extData clearValues];
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


//--------- Test Javascript ---------
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getSomething:(NSString *)destIp portDevice:(NSString *)portDevice callback:(RCTResponseSenderBlock)callback)
{
//  NSString* someString = @"Hello Phi";
  callback(@[destIp]);
  
}

@end
