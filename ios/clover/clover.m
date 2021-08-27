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

@implementation clover

- (instancetype)init
{
  self = [super init];
  if (self) {
    CloverManager *clover = [CloverManager alloc];
    clover.cloverDelegate = self;
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

- (NSArray<NSString *> *)supportedEvents {
    return @[];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(sendTransaction:(NSDictionary *)paymentInfo)
{
  [self sendEventWithName:@"PAYMENT_SUCCESS" body:@{@"response": @""}];
}

RCT_EXPORT_METHOD(cancelTransaction){
}

- (void)paymentFailWithErrorMessage:(NSString * _Nonnull)errorMessage {
  [self sendEventWithName:@"PAYMENT_FAILED" body:@{@"errorMessage": errorMessage}];
}

- (void)paymentSuccessWithResponse:(NSDictionary * _Nonnull)response {
  [self sendEventWithName:@"PAYMENT_SUCCESS" body:@{@"response": response}];
}

@end



