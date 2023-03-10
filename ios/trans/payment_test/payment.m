//
//  payment.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "payment.h"
#import "CommSetting.h"
#import "PosLink.h"
#import "PaymentRequest.h"
#import "PaymentResponse.h"
#import "ProcessTransResult.h"
#import "MyPax.h"

#define keySaveSigPath @"SigFilePath"

static NSString *signData;
//static int statusCode;

@implementation payment

- (void)load {
    
    id idTemp;
    
    NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
    MyPax *mypax = [MyPax sharedSigleton];
    if ((idTemp = [settings objectForKey:keySaveSigPath]) != nil) {
      mypax.poslink.paymentRequest.SigSavePath = (NSString *)idTemp;
    }
}

- (void)save {
    
    NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
    self.mypax = [MyPax sharedSigleton];
    if (self.mypax.poslink.paymentRequest.SigSavePath != nil && self.mypax.poslink.paymentRequest.SigSavePath > 0){
        [settings setObject:self.mypax.poslink.paymentRequest.SigSavePath forKey:keySaveSigPath];
    }
}

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
  self.mypax = [MyPax sharedSigleton];
  
//  ------------------ Setting -------------
//  self.mypax.poslink.commSetting.commType = @"TCP";
//  self.mypax.poslink.commSetting.destIP = @"192.168.50.12";
//  self.mypax.poslink.commSetting.destPort = @"10009";
//  self.mypax.poslink.commSetting.timeout = @"90000";
//  self.mypax.poslink.commSetting.bluetoothAddr = @"";
  
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  
  paymentRequest.TenderType = [PaymentRequest ParseTenderType:tenderType]; // CREDIT,DEBIT
  paymentRequest.TransType = [PaymentRequest ParseTransType:transType]; // SALE,VOID,RETURN
   
   paymentRequest.Amount = amount;
   paymentRequest.CashBackAmt = @"";
   paymentRequest.ClerkID = @"";
    [self load];
    paymentRequest.SigSavePath = @"";
   [self save];
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
  
  self.mypax.poslink.paymentRequest = paymentRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

    ProcessTransResult *ret = [self.mypax.poslink processTrans:PAYMENT];
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
        if([self.mypax.poslink.paymentResponse.ResultCode isEqual: @"000000"]){
          NSDictionary *dataSuccess = @{@"status":@true,
                                        @"ResultCode" : self.mypax.poslink.paymentResponse.ResultCode ? self.mypax.poslink.paymentResponse.ResultCode : @"",
                                        @"ResultTxt" : self.mypax.poslink.paymentResponse.ResultTxt ? self.mypax.poslink.paymentResponse.ResultTxt : @"",
                                        @"AuthCode" : self.mypax.poslink.paymentResponse.AuthCode ? self.mypax.poslink.paymentResponse.AuthCode : @"",
                                        @"ApprovedAmount" : self.mypax.poslink.paymentResponse.ApprovedAmount ? self.mypax.poslink.paymentResponse.ApprovedAmount : @"",
                                        @"AvsResponse" : self.mypax.poslink.paymentResponse.AvsResponse ? self.mypax.poslink.paymentResponse.AvsResponse : @"",
                                        @"BogusAccountNum" : self.mypax.poslink.paymentResponse.BogusAccountNum ? self.mypax.poslink.paymentResponse.BogusAccountNum : @"",
                                        @"CardType" : self.mypax.poslink.paymentResponse.CardType ? self.mypax.poslink.paymentResponse.CardType : @"",
                                        @"CvResponse" : self.mypax.poslink.paymentResponse.CvResponse ? self.mypax.poslink.paymentResponse.CvResponse : @"",
                                        @"HostCode" : self.mypax.poslink.paymentResponse.HostCode ? self.mypax.poslink.paymentResponse.HostCode : @"",
                                        @"HostResponse" : self.mypax.poslink.paymentResponse.HostResponse ?  self.mypax.poslink.paymentResponse.HostResponse : @"",
                                        @"RawResponse" : self.mypax.poslink.paymentResponse.RawResponse ?  self.mypax.poslink.paymentResponse.RawResponse : @"",
                                        @"Message" : self.mypax.poslink.paymentResponse.Message ? self.mypax.poslink.paymentResponse.Message : @"",
                                        @"RefNum" : self.mypax.poslink.paymentResponse.RefNum ? self.mypax.poslink.paymentResponse.RefNum : @"",
                                        @"RemainingBalance" : self.mypax.poslink.paymentResponse.RemainingBalance ? self.mypax.poslink.paymentResponse.RemainingBalance : @"",
                                        @"ExtraBalance" : self.mypax.poslink.paymentResponse.ExtraBalance ? self.mypax.poslink.paymentResponse.ExtraBalance : @"",
                                        @"Timestamp" : self.mypax.poslink.paymentResponse.Timestamp ?  self.mypax.poslink.paymentResponse.Timestamp : @"",
                                        @"InvNum" : self.mypax.poslink.paymentResponse.InvNum ? self.mypax.poslink.paymentResponse.InvNum : @"",
                                        @"ExtData" : self.mypax.poslink.paymentResponse.ExtData ? self.mypax.poslink.paymentResponse.ExtData : @"",
                                        @"RequestedAmount" : self.mypax.poslink.paymentResponse.RequestedAmount ? self.mypax.poslink.paymentResponse.RequestedAmount : @"",
                                        @"SignData": self.mypax.poslink.paymentResponse.signData ? self.mypax.poslink.paymentResponse.signData  : @""
                                        };
          
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          callback(@[result]);
        }else{
          //--------- Handle Duplication ---------
          NSDictionary *dupError = @{@"status":@false,
                                      @"message":self.mypax.poslink.paymentResponse.ResultTxt ? self.mypax.poslink.paymentResponse.ResultTxt : @"The transaction was closed!"
                                   
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
//      self.mypax = nil;

    });
  });
  
}

RCT_EXPORT_METHOD(cancelTransaction){
  self.mypax = [MyPax sharedSigleton];
  
  self.mypax.poslink.commSetting.commType = @"TCP";
  self.mypax.poslink.commSetting.destIP = @"192.168.50.12";
  self.mypax.poslink.commSetting.destPort = @"10009";
  self.mypax.poslink.commSetting.timeout = @"90000";
  self.mypax.poslink.commSetting.bluetoothAddr = @"";
  
  [self.mypax.poslink cancelTrans];
  
  //      ------- Cancel Object --------
//  self.mypax = nil;
}


@end
