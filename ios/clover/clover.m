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
static NSString* deviceReady              = @"deviceReady";
static NSString* confirmPayment              = @"confirmPayment";
static NSString* printInProcess         = @"printInProcess";
static NSString* printDone              = @"printDone";
static NSString* deviceDisconnected     = @"deviceDisconnected";

@interface clover () <CloverManagerDelegate>
@property (nonatomic) BOOL listening;
@property (nonatomic) BOOL isPaymentProcessing;
@property (nonatomic) BOOL isPrintWithConnectProcessing;
@property (nonatomic, strong) CloverManager *clover;
@property (nonatomic, strong) NSDictionary *paymentInfo;
@property (nonatomic, strong) NSString *imageUri;
@end

@implementation clover

- (instancetype)init
{
  self = [super init];
  if (self) {
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
    deviceReady,
    confirmPayment,
    printInProcess,
    printDone,
    deviceDisconnected,
  ];
}

RCT_EXPORT_METHOD(changeListenerStatus:(BOOL)value) {
    self.listening = value;
}

RCT_EXPORT_METHOD(sendTransaction:(NSDictionary *)paymentInfo)
{
  self.isPaymentProcessing = true;
  self.paymentInfo = paymentInfo;
  self.clover = [CloverManager alloc];
  self.clover.cloverDelegate = self;
  NSString *url = paymentInfo[@"url"];
  NSString *remoteAppId = paymentInfo[@"remoteAppId"];
  NSString *appName = paymentInfo[@"appName"];
  NSString *posSerial = paymentInfo[@"posSerial"];
  NSString *token = paymentInfo[@"token"];
  
  [self.clover connect:url appId: remoteAppId appName: appName posSerial: posSerial token: token];
  
}

RCT_EXPORT_METHOD(confirmPayment){
  [self.clover confirmPayment];
}

RCT_EXPORT_METHOD(rejectPayment){
  self.isPaymentProcessing = false;
  [self.clover rejectPayment];
}

RCT_EXPORT_METHOD(cancelTransaction){
  self.isPaymentProcessing = false;
  
}

RCT_EXPORT_METHOD(doPrint:(NSString *)imageURI){
 
  UIImage *image = [self getImageFromPath:imageURI];
  [self.clover doPrintWithImage:image];
  
}

- (UIImage*) getImageFromPath:(NSString*)imageURI {
  NSError *error = nil;
  NSURL *imageURL = [NSURL URLWithString:imageURI];
  NSData *imageData = [NSData dataWithContentsOfURL:imageURL options:NSDataReadingUncached error:&error];

  if (error != nil) {
      NSURL *fileImageURL = [NSURL fileURLWithPath:imageURI];
      [fileImageURL startAccessingSecurityScopedResource];
      imageData = [NSData dataWithContentsOfURL:fileImageURL];
    [fileImageURL stopAccessingSecurityScopedResource];
  }

  UIImage *image = [UIImage imageWithData:imageData];
  return image;
}

RCT_EXPORT_METHOD(doPrintWithConnect:(NSDictionary *)printInfo){
  self.isPrintWithConnectProcessing = true;
  NSString *imageURI = printInfo[@"imageUri"];
  if(self.clover){
    UIImage *image = [self getImageFromPath:imageURI];
    [self.clover doPrintWithImage:image];
  }else{
    self.clover = [CloverManager alloc];
    self.clover.cloverDelegate = self;
    NSString *url = printInfo[@"url"];
    NSString *remoteAppId = printInfo[@"remoteAppId"];
    NSString *appName = printInfo[@"appName"];
    NSString *posSerial = printInfo[@"posSerial"];
    NSString *token = printInfo[@"token"];
    self.imageUri = imageURI;
    
    [self.clover connect:url appId: remoteAppId appName: appName posSerial: posSerial token: token];
  }
}


/*----- DELEGATE FROM CloverManager ------*/

- (void)paymentFailWithErrorMessage:(NSString * _Nonnull)errorMessage {
  self.isPaymentProcessing = false;
  [self sendEventWithName:paymentFail body:@{@"errorMessage": errorMessage}];
}

- (void)paymentSuccessWithResponse:(NSDictionary * _Nonnull)response {
  self.isPaymentProcessing = false;
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

- (void)onDeviceReady {
  if (self.listening) {
    [self sendEventWithName:deviceReady body:nil];
  }
  if (self.isPaymentProcessing) {
    [self.clover doSaleWithPaymentInfo: self.paymentInfo];
  } else if(self.isPrintWithConnectProcessing){
    UIImage *image = [self getImageFromPath:self.imageUri];
    [self.clover doPrintWithImage: image];
  }
 
}

- (void)onDeviceDisconnected {
  if (self.listening) {
    [self sendEventWithName:deviceDisconnected body:nil];
  }
}

- (void)onConfirmPayment {
    if (self.listening) {
      [self sendEventWithName:confirmPayment body:nil];
    }
}

- (void)printInProcess {
  if (self.listening) {
    [self sendEventWithName:printInProcess body:nil];
  }
}

- (void)printDoneWithMessage:(NSString * _Nonnull)message {
  self.isPrintWithConnectProcessing = false;
  if (self.listening) {
    [self sendEventWithName:printDone body:message];
  }
}

@end



