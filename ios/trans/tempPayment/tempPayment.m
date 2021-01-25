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

// MyPax *mypax;
NSString *tempIdAddrBluetooth;

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(setIdAddrBluetooth:(NSString *) addr){
  tempIdAddrBluetooth = addr;
 
}

RCT_EXPORT_METHOD(sendTransactionByBluetooth:(NSDictionary *)paymentInfo callback:(RCTResponseSenderBlock)callback)
{
  
  MyPax *mypax =  [[MyPax alloc] init];
  
//  ------------------ Setting -------------
  mypax.poslink.commSetting.commType = paymentInfo[@"commType"];
  mypax.poslink.commSetting.destIP = paymentInfo[@"destIp"] ;
  mypax.poslink.commSetting.destPort = paymentInfo[@"portDevice"];
  mypax.poslink.commSetting.timeout = paymentInfo[@"timeoutConnect"];

  tempIdAddrBluetooth = paymentInfo[@"bluetoothAddr"];
  mypax.poslink.commSetting.bluetoothAddr = tempIdAddrBluetooth;
  

  
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  
  paymentRequest.TenderType = [PaymentRequest ParseTenderType:paymentInfo[@"tenderType"]]; // CREDIT,DEBIT
  paymentRequest.TransType = [PaymentRequest ParseTransType:paymentInfo[@"transType"]]; // SALE,VOID,RETURN
   
   paymentRequest.Amount =paymentInfo[@"amount"];
   paymentRequest.CashBackAmt = @"";
   paymentRequest.ClerkID = @"";
    paymentRequest.SigSavePath = @"";
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
  paymentRequest.ECRRefNum = paymentInfo[@"transactionId"];
   paymentRequest.ECRTransID = @"";
   paymentRequest.AuthCode = @"";
   paymentRequest.ExtData = paymentInfo[@"extData"];
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
//      mypax = nil;

    });
  });
  
}

RCT_EXPORT_METHOD(sendTransaction:(NSDictionary *)paymentInfo callback:(RCTResponseSenderBlock)callback)
{
  
  MyPax  *mypax =  [[MyPax alloc] init];
  
//  ------------------ Setting -------------
  mypax.poslink.commSetting.commType = paymentInfo[@"commType"];
  mypax.poslink.commSetting.destIP = paymentInfo[@"destIp"] ;
  mypax.poslink.commSetting.destPort = paymentInfo[@"portDevice"];
  mypax.poslink.commSetting.timeout = paymentInfo[@"timeoutConnect"];
  
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  
  paymentRequest.TenderType = [PaymentRequest ParseTenderType:paymentInfo[@"tenderType"]]; // CREDIT,DEBIT
  paymentRequest.TransType = [PaymentRequest ParseTransType:paymentInfo[@"transType"]]; // SALE,VOID,RETURN
   
   paymentRequest.Amount =paymentInfo[@"amount"];
   paymentRequest.CashBackAmt = @"";
   paymentRequest.ClerkID = @"";
    paymentRequest.SigSavePath = @"";
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
  paymentRequest.ECRRefNum = paymentInfo[@"transactionId"];
   paymentRequest.ECRTransID = @"";
   paymentRequest.AuthCode = @"";
   paymentRequest.ExtData = paymentInfo[@"extData"];
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
//      mypax = nil;

    });
  });
  
}


RCT_EXPORT_METHOD(cancelTransaction){
//  if(mypax){
//    [mypax.poslink cancelTrans];
//  }
//  mypax = nil;
  
  MyPax  *mypax =  [[MyPax alloc] init];
  [mypax.poslink cancelTrans];
 
}

@end


