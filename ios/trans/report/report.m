//
//  report.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 19/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "report.h"
#import "MyPax.h"
#import "ReportRequest.h"
#import "ReportResponse.h"
#import "ProcessTransResult.h"


@implementation report

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(reportTransaction:
                  (NSString *)transType
                  edcType:(NSString *)edcType
                  cardType:(NSString *)cardType
                  paymentType:(NSString *)paymentType
                  findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
//  MyPax *mypax = [MyPax sharedSigleton];
  MyPax *mypax =  [[MyPax alloc] init];
  
//  --------- setting --------
  mypax.poslink.commSetting.commType = @"TCP";
  mypax.poslink.commSetting.destIP = @"192.168.50.12";
  mypax.poslink.commSetting.destPort = @"10009";
  mypax.poslink.commSetting.timeout = @"90000";
  mypax.poslink.commSetting.bluetoothAddr = @"";
  
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
  reportRequest.LASTTRANSACTION = @"";
  reportRequest.ExtData = @"";
  
  mypax.poslink.reportRequest = reportRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

    ProcessTransResult *ret = [mypax.poslink processTrans:REPORT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      
      if (ret.code == OK ) {
//        if([ mypax.poslink.reportResponse.ResultCode  isEqual: @"000000"]){
          NSDictionary *dataSuccess = @{
            @"status":@true,
            @"ResultCode" : mypax.poslink.reportResponse.ResultCode ? mypax.poslink.reportResponse.ResultCode : @"" ,
            @"ResultTxt" : mypax.poslink.reportResponse.ResultTxt ? mypax.poslink.reportResponse.ResultTxt : @"" ,
            @"TotalRecord" : mypax.poslink.reportResponse.TotalRecord ? mypax.poslink.reportResponse.TotalRecord : @"" ,
            @"Message" : mypax.poslink.reportResponse.Message ? mypax.poslink.reportResponse.Message : @"" ,
            @"ApprovedAmount" : mypax.poslink.reportResponse.ApprovedAmount ? mypax.poslink.reportResponse.ApprovedAmount : @"" ,
            @"CreditCount" : mypax.poslink.reportResponse.CreditCount ? mypax.poslink.reportResponse.CreditCount : @"" ,
            @"CreditAmount" : mypax.poslink.reportResponse.CreditAmount ? mypax.poslink.reportResponse.CreditAmount : @"" ,
            @"ExtData" : mypax.poslink.reportResponse.ExtData ? mypax.poslink.reportResponse.ExtData : @"" ,
          };
          
          NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
          resolve(@[result]);
      
        
       
//        }else{
//          
//          NSDictionary *dataError = @{@"status":@false, @"message":mypax.poslink.reportResponse.ResultTxt };
//          NSString *domain = @"com.harmony.pos.paxError";
//          NSError *error = [NSError errorWithDomain:domain code:-101 userInfo:dataError];
//          reject(@"no_events", mypax.poslink.reportResponse.ResultTxt,error);
//        }
        
      }else{
        NSDictionary *dataError = @{@"status":@false, @"message":ret.msg };
        NSString *domain = @"com.harmony.pos.paxError";
        NSError *error = [NSError errorWithDomain:domain code:-101 userInfo:dataError];
        reject(@"no_events", ret.msg,error);
        
      
      }
        
    });
    
  });
  
}


@end


