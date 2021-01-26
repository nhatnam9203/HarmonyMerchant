//
//  report.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 19/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "report.h"
#import "ReportRequest.h"
#import "ReportResponse.h"
#import "ProcessTransResult.h"
#import "CommSetting.h"
#import "PosLink.h"

@implementation report

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(reportTransaction:(NSDictionary *)reportInfo findEventsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  CommSetting *commSetting = [[CommSetting alloc]init];
  
  _tempIdAddrBluetooth = reportInfo[@"bluetoothAddr"];
  
  commSetting.commType = reportInfo[@"commType"];
  commSetting.destIP = reportInfo[@"destIp"];
  commSetting.destPort = reportInfo[@"portDevice"];
  commSetting.timeout = reportInfo[@"timeoutConnect"];
  commSetting.bluetoothAddr = _tempIdAddrBluetooth;
  
  PosLink *poslink = [[PosLink alloc]initWithCommSetting:commSetting];
  
  ReportRequest *reportRequest = [[ReportRequest alloc] init];
  
  reportRequest.TransType = [ReportRequest ParseTransType:reportInfo[@"transType"]];
   reportRequest.EDCType = [ReportRequest ParseEDCType:reportInfo[@"edcType"]];
  reportRequest.CardType = [ReportRequest ParseCardType:reportInfo[@"cardType"]];
 reportRequest.PaymentType = [ReportRequest ParsePaymentType:reportInfo[@"paymentType"]];
  
  reportRequest.RecordNum = @"";
  reportRequest.RefNum = @"";
  reportRequest.AuthCode = @"";
  reportRequest.ECRRefNum = @"";
  reportRequest.SAFIndicator = @"";
  reportRequest.LASTTRANSACTION = @"";
  reportRequest.ExtData = @"";
  
  poslink.reportRequest = reportRequest;
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    ProcessTransResult *ret = [poslink processTrans:REPORT];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (ret.code == OK ) {
        
        NSDictionary *dataSuccess = @{
          @"status":@true,
          @"ResultCode" : poslink.reportResponse.ResultCode ? poslink.reportResponse.ResultCode : @"" ,
          @"ResultTxt" : poslink.reportResponse.ResultTxt ? poslink.reportResponse.ResultTxt : @"" ,
          @"TotalRecord" : poslink.reportResponse.TotalRecord ? poslink.reportResponse.TotalRecord : @"" ,
          @"Message" : poslink.reportResponse.Message ? poslink.reportResponse.Message : @"" ,
          @"ApprovedAmount" : poslink.reportResponse.ApprovedAmount ? poslink.reportResponse.ApprovedAmount : @"" ,
          @"CreditCount" : poslink.reportResponse.CreditCount ? poslink.reportResponse.CreditCount : @"" ,
          @"CreditAmount" : poslink.reportResponse.CreditAmount ? poslink.reportResponse.CreditAmount : @"" ,
          @"ExtData" : poslink.reportResponse.ExtData ? poslink.reportResponse.ExtData : @"" ,
        };
        
        NSString  *result =  [self convertObjectToJson:dataSuccess ] ;
        resolve(@[result]);
        
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


