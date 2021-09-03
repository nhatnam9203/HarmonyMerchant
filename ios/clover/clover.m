//
//  clover.m
//  Hpmerchant
//
//  Created by Duyen Hang on 13/08/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "clover.h"
#import "Hpmerchant_Dev-Swift.h"

static NSString* paymentSuccess               = @"paymentSuccess";
static NSString* paymentFail               = @"paymentFail";
static NSString* pairingCode               = @"pairingCode";
static NSString* pairingSuccess               = @"pairingSuccess";

@interface clover () <CloverManagerDelegate>
@property (nonatomic) BOOL listening;

@end

@implementation clover

- (instancetype)init
{
  self = [super init];
  if (self) {
//    CloverManager *clover = [CloverManager alloc];
//    clover.cloverDelegate = self;
  }
  return self;
}

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[
    paymentSuccess,
    paymentFail,
    pairingCode,
    pairingSuccess,
  ];
}

RCT_EXPORT_METHOD(changeListenerStatus:(BOOL)value) {
    self.listening = value;
}

RCT_EXPORT_METHOD(sendTransaction:(NSDictionary *)paymentInfo)
{
  CloverManager *clover = [CloverManager alloc];
  clover.cloverDelegate = self;
  NSString *url = paymentInfo[@"url"];
  NSString *remoteAppId = paymentInfo[@"remoteAppId"];
  NSString *appName = paymentInfo[@"appName"];
  NSString *posSerial = paymentInfo[@"posSerial"];
  
  [clover connect:url appId: remoteAppId appName: appName posSerial: posSerial];
}

RCT_EXPORT_METHOD(cancelTransaction){
}

- (void)paymentFailWithErrorMessage:(NSString * _Nonnull)errorMessage {
  [self sendEventWithName:paymentFail body:@{@"errorMessage": errorMessage}];
}

- (void)paymentSuccessWithResponse:(NSDictionary * _Nonnull)response {
   if (self.listening) {
        [self sendEventWithName:paymentSuccess body:response];
    }
}

- (void)pairingCodeWithString:(NSString * _Nonnull)string {
  if (self.listening) {
    [self sendEventWithName:pairingCode body:@{@"pairingCode": string}];
  }
}

- (void)pairingSuccessWithToken:(NSString * _Nonnull)token {
  if (self.listening) {
    [self sendEventWithName:pairingSuccess body:@{@"token": token}];
  }
}

@end



