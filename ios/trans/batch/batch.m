//
//  batch.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 19/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "batch.h"
#import "MyPax.h"
#import "BatchResponse.h"
#import "ProcessTransResult.h"

@implementation batch

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(batchTransaction:(RCTResponseSenderBlock)callback){
  
  MyPax *mypax = [MyPax sharedSigleton];
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
  
  mypax.poslink.batchRequest = batchRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    ProcessTransResult *ret = [mypax.poslink processTrans:BATCH];
    dispatch_async(dispatch_get_main_queue(), ^{
      
      if (ret.code == OK){
        NSDictionary *dataSuccess = @{
          @"status":@true,
          @"ResultCode" : mypax.poslink.batchResponse.ResultCode ? mypax.poslink.batchResponse.ResultCode : @"" ,
          @"ResultTxt" : mypax.poslink.batchResponse.ResultTxt ? mypax.poslink.batchResponse.ResultTxt : @"",
          @"CreditCount" :mypax.poslink.batchResponse.CreditCount ? mypax.poslink.batchResponse.CreditCount : @"",
          @"CreditAmount" :  mypax.poslink.batchResponse.CreditAmount ?  mypax.poslink.batchResponse.CreditAmount : @"",
          @"DebitCount" : mypax.poslink.batchResponse.DebitCount ?  mypax.poslink.batchResponse.DebitCount : @"",
          @"DebitAmount" : mypax.poslink.batchResponse.DebitAmount ? mypax.poslink.batchResponse.DebitAmount : @"",
          @"EBTCount" : mypax.poslink.batchResponse.EBTCount  ? mypax.poslink.batchResponse.EBTCount : @"",
          @"EBTAmount" : mypax.poslink.batchResponse.EBTAmount ? mypax.poslink.batchResponse.EBTAmount : @"" ,
          @"GiftCount" : mypax.poslink.batchResponse.GiftCount ? mypax.poslink.batchResponse.GiftCount : @"",
          @"GiftAmount" : mypax.poslink.batchResponse.GiftAmount ? mypax.poslink.batchResponse.GiftAmount : @"",
          @"LoyaltyCount" : mypax.poslink.batchResponse.LoyaltyCount ? mypax.poslink.batchResponse.LoyaltyCount : @"",
          @"LoyaltyAmount" :mypax.poslink.batchResponse.LoyaltyAmount ? mypax.poslink.batchResponse.LoyaltyAmount : @"",
          @"CashCount" : mypax.poslink.batchResponse.CashCount ? mypax.poslink.batchResponse.CashCount : @"",
          @"CashAmount" : mypax.poslink.batchResponse.CashAmount ?  mypax.poslink.batchResponse.CashAmount : @"",
          @"CHECKCount" : mypax.poslink.batchResponse.CHECKCount ? mypax.poslink.batchResponse.CHECKCount : @"",
          @"CHECKAmount" : mypax.poslink.batchResponse.CHECKAmount ? mypax.poslink.batchResponse.CHECKAmount : @"",
          @"Timestamp" : mypax.poslink.batchResponse.Timestamp ? mypax.poslink.batchResponse.Timestamp : @"",
          @"TID" :mypax.poslink.batchResponse.TID ? mypax.poslink.batchResponse.TID : @"",
          @"MID" : mypax.poslink.batchResponse.MID ? mypax.poslink.batchResponse.MID : @"",
          @"HostTraceNum" : mypax.poslink.batchResponse.HostTraceNum ?  mypax.poslink.batchResponse.HostTraceNum : @"",
          @"BatchNum" : mypax.poslink.batchResponse.BatchNum ? mypax.poslink.batchResponse.BatchNum : @"",
          @"AuthCode" : mypax.poslink.batchResponse.AuthCode ? mypax.poslink.batchResponse.AuthCode : @"",
          @"HostCode" : mypax.poslink.batchResponse.HostCode ? mypax.poslink.batchResponse.HostCode : @"",
          @"HostResponse" : mypax.poslink.batchResponse.HostResponse ? mypax.poslink.batchResponse.HostResponse : @"",
          @"Message" : mypax.poslink.batchResponse.Message ?  mypax.poslink.batchResponse.Message : @"",
          @"ExtData" : mypax.poslink.batchResponse.ExtData ?  mypax.poslink.batchResponse.ExtData : @"",
          @"BatchFailedRefNum" : mypax.poslink.batchResponse.BatchFailedRefNum ? mypax.poslink.batchResponse.BatchFailedRefNum : @"",
          @"BatchFailedCount" : mypax.poslink.batchResponse.BatchFailedCount ? mypax.poslink.batchResponse.BatchFailedCount : @"",
          @"SAFTotalCount" : mypax.poslink.batchResponse.SAFTotalCount ? mypax.poslink.batchResponse.SAFTotalCount : @"",
          @"SAFTotalAmount" : mypax.poslink.batchResponse.SAFTotalAmount ? mypax.poslink.batchResponse.SAFTotalAmount : @"",
          @"SAFUploadedCount" : mypax.poslink.batchResponse.SAFUploadedCount ?  mypax.poslink.batchResponse.SAFUploadedCount : @"",
          @"SAFUploadedAmount" : mypax.poslink.batchResponse.SAFUploadedAmount ? mypax.poslink.batchResponse.SAFUploadedAmount : @"",
          @"SAFFailedCount" : mypax.poslink.batchResponse.SAFFailedCount ? mypax.poslink.batchResponse.SAFFailedCount : @"",
          @"SAFFailedTotal" : mypax.poslink.batchResponse.SAFFailedTotal ? mypax.poslink.batchResponse.SAFFailedTotal : @"",
          @"SAFDeletedCount" : mypax.poslink.batchResponse.SAFDeletedCount ? mypax.poslink.batchResponse.SAFDeletedCount : @"",
        };
        
        NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
        callback(@[result]);
        
      }else{
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
