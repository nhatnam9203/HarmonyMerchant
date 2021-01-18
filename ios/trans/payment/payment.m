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
static int statusCode;

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

RCT_EXPORT_METHOD(sendTransaction:(NSString *)tenderType amount:(NSString *)amount tipAmount:(NSString *)tipAmount extData:(NSString *)extData callback:(RCTResponseSenderBlock)callback)
{
  self.mypax = [MyPax sharedSigleton];
  PaymentRequest *paymentRequest = [[PaymentRequest alloc] init];
  self.mypax.poslink.paymentRequest = paymentRequest;
  
  paymentRequest.TenderType = [PaymentRequest ParseTenderType:tenderType];
   paymentRequest.TransType = [PaymentRequest ParseTransType:@"SALE"];
   
   paymentRequest.Amount = amount;
   paymentRequest.CashBackAmt = @"";
   paymentRequest.ClerkID = @"";
    [self load];
    paymentRequest.SigSavePath = @"";
   [self save];
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
   paymentRequest.ExtData = extData;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

    __weak typeof(self) weakSelf = self;
    self.mypax.poslink.reportedStatusChangeBlock = ^{
      statusCode = [weakSelf.mypax.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
       
      });
      NSLog(@"Terminal ReportedStatus = %d",statusCode);
    };

    ProcessTransResult *ret = [self.mypax.poslink processTrans:PAYMENT];
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK) {
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
                                      };
   
        
        signData = self.mypax.poslink.paymentResponse.signData;

        if (signData != nil) {
          NSString *str = [self.mypax.poslink.paymentResponse.Timestamp stringByAppendingFormat:@"_%@",self.mypax.poslink.paymentResponse.RefNum];
          [self.mypax.poslink.paymentRequest saveSigData:signData fileName:str];
        }
        
      

        NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
        callback(@[result]);
        return;
      }else {
        NSDictionary *dataError = @{@"status":@false,
                                    @"message":ret.msg
                                      };
         NSString  *resultError =  [self convertObjectToJson:dataError ] ;
        callback(@[resultError]);
        return;
      }

    });
  });
  
}


@end
