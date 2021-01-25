//
//  report.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 19/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "tempPayment.h"
#import "CommSetting.h"
#import "PosLink.h"
#import "PaymentRequest.h"
#import "PaymentResponse.h"
#import "ProcessTransResult.h"
#import "MyPax.h"


@implementation tempPayment

 MyPax *mypax;

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(sendTransaction:(NSString *)tenderType
                  transType:(NSString *)transType
                  amount:(NSString *)amount
                  transactionId:(NSString *)transactionId
                  extData:(NSString *)extData
                  
                  
                  callback:(RCTResponseSenderBlock)callback
                  )
{
//  mypax = [MyPax sharedSigleton];
  mypax =  [[MyPax alloc] init];
  
//  ------------------ Setting -------------
  mypax.poslink.commSetting.commType = @"TCP";
  mypax.poslink.commSetting.destIP = @"192.168.50.12";
  mypax.poslink.commSetting.destPort = @"10009";
  mypax.poslink.commSetting.timeout = @"90000";
  mypax.poslink.commSetting.bluetoothAddr = @"";
  
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  
  paymentRequest.TenderType = [PaymentRequest ParseTenderType:tenderType]; // CREDIT,DEBIT
  paymentRequest.TransType = [PaymentRequest ParseTransType:transType]; // SALE,VOID,RETURN
   
   paymentRequest.Amount = amount;
   paymentRequest.CashBackAmt = @"";
   paymentRequest.ClerkID = @"";
//    [self load];
    paymentRequest.SigSavePath = @"";
//   [self save];
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
  paymentRequest.ContinuousScreen = @"";
  paymentRequest.ServiceFee = @"";
  
  mypax.poslink.paymentRequest = paymentRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

    ProcessTransResult *ret = [mypax.poslink processTrans:PAYMENT];
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK ) {
        if([mypax.poslink.paymentResponse.ResultCode isEqual: @"000000"]){
          NSDictionary *dataSuccess = @{@"status":@true,
                                        @"ResultCode" : mypax.poslink.paymentResponse.ResultCode ? mypax.poslink.paymentResponse.ResultCode : @"",
                                        @"ResultTxt" : mypax.poslink.paymentResponse.ResultTxt ? mypax.poslink.paymentResponse.ResultTxt : @"",
                                        @"AuthCode" : mypax.poslink.paymentResponse.AuthCode ? mypax.poslink.paymentResponse.AuthCode : @"",
                                        @"ApprovedAmount" : mypax.poslink.paymentResponse.ApprovedAmount ? mypax.poslink.paymentResponse.ApprovedAmount : @"",
                                        @"AvsResponse" : mypax.poslink.paymentResponse.AvsResponse ? mypax.poslink.paymentResponse.AvsResponse : @"",
                                        @"BogusAccountNum" : mypax.poslink.paymentResponse.BogusAccountNum ? mypax.poslink.paymentResponse.BogusAccountNum : @"",
                                        @"CardType" : mypax.poslink.paymentResponse.CardType ? mypax.poslink.paymentResponse.CardType : @"",
                                        @"CvResponse" : mypax.poslink.paymentResponse.CvResponse ? mypax.poslink.paymentResponse.CvResponse : @"",
                                        @"HostCode" : mypax.poslink.paymentResponse.HostCode ? mypax.poslink.paymentResponse.HostCode : @"",
                                        @"HostResponse" : mypax.poslink.paymentResponse.HostResponse ?  mypax.poslink.paymentResponse.HostResponse : @"",
                                        @"RawResponse" : mypax.poslink.paymentResponse.RawResponse ?  mypax.poslink.paymentResponse.RawResponse : @"",
                                        @"Message" : mypax.poslink.paymentResponse.Message ? mypax.poslink.paymentResponse.Message : @"",
                                        @"RefNum" : mypax.poslink.paymentResponse.RefNum ? mypax.poslink.paymentResponse.RefNum : @"",
                                        @"RemainingBalance" : mypax.poslink.paymentResponse.RemainingBalance ? mypax.poslink.paymentResponse.RemainingBalance : @"",
                                        @"ExtraBalance" : mypax.poslink.paymentResponse.ExtraBalance ? mypax.poslink.paymentResponse.ExtraBalance : @"",
                                        @"Timestamp" : mypax.poslink.paymentResponse.Timestamp ?  mypax.poslink.paymentResponse.Timestamp : @"",
                                        @"InvNum" : mypax.poslink.paymentResponse.InvNum ? mypax.poslink.paymentResponse.InvNum : @"",
                                        @"ExtData" : mypax.poslink.paymentResponse.ExtData ? mypax.poslink.paymentResponse.ExtData : @"",
                                        @"RequestedAmount" : mypax.poslink.paymentResponse.RequestedAmount ? mypax.poslink.paymentResponse.RequestedAmount : @"",
                                        @"SignData": mypax.poslink.paymentResponse.signData ? mypax.poslink.paymentResponse.signData  : @""
                                        };
          
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          callback(@[result]);
        }else{
          //--------- Handle Duplication ---------
          NSDictionary *dupError = @{
                                      @"status":@false,
                                      @"message":mypax.poslink.paymentResponse.ResultTxt ? mypax.poslink.paymentResponse.ResultTxt : @"ABORTED"
                                   
                                        };
          NSString  *hanldeDup =  [self convertObjectToJson:dupError ] ;
          callback(@[hanldeDup]);
        }
      }else {
        NSDictionary *dataError = @{@"status":@false,
                                    @"message":ret.msg
                                      };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
        callback(@[resultError]);
      }
      
      //      ------- Cancel Object --------
      mypax = nil;

    });
  });
  
}


RCT_EXPORT_METHOD(cancelTransaction){
  if(mypax){
    [mypax.poslink cancelTrans];
  }
  mypax = nil;
 
}

@end


