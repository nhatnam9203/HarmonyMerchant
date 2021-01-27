//
//  MyPax.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "MyPax.h"
#import "CommSetting.h"
#import "PosLink.h"

@implementation MyPax
{
    CommSetting *commSetting;
}

@synthesize PaymentReqExtData;
@synthesize poslink;

+ (MyPax*) sharedSigleton
{
    static MyPax *mypax = nil;
    
    @synchronized (self) {
        if (mypax == nil)
        {
          mypax = [[MyPax alloc] init];
        }
        
        return mypax;
    }
}

- (id)init
{
  self = [super init];
  commSetting = [[CommSetting alloc]init];
  poslink = [[PosLink alloc]initWithCommSetting:commSetting];
  
  //init PaymentReqExtData //init PaymentReqExtData
  NSArray *payReqExtDataNames = [NSArray arrayWithObjects:
                           @"Account Information",
                           @"Check Information",
                           @"Trace Information",
                           @"Cashier Information",
                           @"MOTO/E- Commercial Information",
                           @"Additional Information",
                           nil];
  
  NSArray *AccountInfoKeys = [NSArray arrayWithObjects:@"Account", @"ExpDate", @"CVV", @"EBTFoodStampVoucher", @"EBTType", @"VoucherNum",
                     @"Force", @"FirstName", @"LastName", @"CountryCode",
                              @"StateCode", @"CityName", @"EmailAddress",@"GiftCardType",nil];
  
  NSArray *CheckInfoKeys = [NSArray arrayWithObjects:@"CheckSaleType", @"CheckRoutingNum", @"CheckNum",
                   @"CheckType", @"CheckIDType", @"CheckIDValue", @"Birth", @"PhoneNum", nil];
  
  NSArray *TraceInfoKeys = [NSArray arrayWithObjects:@"TimeStamp",@"OrigECRRefNum", nil];
  
  NSArray *CashierInfoKeys = [NSArray arrayWithObjects:@"ShiftID", nil];
  
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
                           @"VehicleID", @"MM_ID", @"MM_Name", @"OrigSettlementDate",@"OrigTransType",@"StationNo",@"UserLanguage",@"AddLRspDataRequest",@"CustomizeData1",@"CustomizeData2",@"CustomizeData3",@"ForceCC",@"ForceFSA",@"eWICDiscountAmount",@"LastTransaction",@"GlobalUID",@"OrigAmount",@"OrigBatchNum",@"OrigTransID",nil];
  
  NSArray *InfoKeysArray = [NSArray arrayWithObjects:AccountInfoKeys, CheckInfoKeys, TraceInfoKeys, CashierInfoKeys, Moto_EComInfoKeys, AddiInfoKeys, nil];
  
  self.PaymentReqExtData = [NSMutableArray array];
  for (int i = 0; i < [payReqExtDataNames count]; i ++)
  {
      [self.PaymentReqExtData setObject:[[ExtDataPaymentReq alloc] initWithName:payReqExtDataNames[i] Keys:InfoKeysArray[i]] atIndexedSubscript:i];
  }
  
  return  self;
}

- (void)clearPaymentReqExtData
{
    for(ExtDataPaymentReq* extData in self.PaymentReqExtData)
    {
        [extData clearValues];
    }
}


@end
