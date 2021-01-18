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
#import "PaymentResponse.h"
#import "ProcessTransResult.h"
#import "MyPax.h"
#import "CommSetting.h"

#define keySaveSigPath @"SigFilePath"
#define keyCommType @"commType"
#define keyTimeout @"timeout"
#define keySerialPort @"serialPort"
#define keyDestIP @"destIP"
#define keyDestPort @"destPort"
#define keyBluetoothAddr @"bluetoothAddr"

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

- (void)saveSetupSetting {
  
  NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
  MyPax *mypax = [MyPax sharedSigleton];
  [settings setObject:mypax.poslink.commSetting.commType forKey:keyCommType];
  [settings setObject:mypax.poslink.commSetting.timeout forKey:keyTimeout];
  [settings setObject:mypax.poslink.commSetting.serialPort forKey:keySerialPort];
  [settings setObject:mypax.poslink.commSetting.destIP forKey:keyDestIP];
  [settings setObject:mypax.poslink.commSetting.destPort forKey:keyDestPort];
  [settings setObject:mypax.poslink.commSetting.bluetoothAddr forKey:keyBluetoothAddr];
  
  [settings synchronize];
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
   paymentRequest.ContinuousScreen = @"";
   paymentRequest.ServiceFee = @"";
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

    __weak typeof(self) weakSelf = self;
    self.mypax.poslink.reportedStatusChangeBlock = ^{
      statusCode = [weakSelf.mypax.poslink getReportedStatus];
      dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Terminal ReportedStatus = %d",statusCode);
      });
    };

    ProcessTransResult *ret = [self.mypax.poslink processTrans:PAYMENT];
//    dispatch_async(dispatch_get_main_queue(), ^{
//
//
//    });
    
  });
  
}



RCT_EXPORT_METHOD(setupPax:(NSString *)commType  destIp:(NSString *)destIp  portDevice:(NSString *)portDevice timeoutConnect:(NSString *)timeoutConnect bluetoothAddr:(NSString *)bluetoothAddr)
{
  MyPax *mypax = [MyPax sharedSigleton];
// commType = @"TCP", @"BLUETOOTH";
//  myapp.poslink.commSetting.commType = @"BLUETOOTH";
  mypax.poslink.commSetting.commType = commType;
  mypax.poslink.commSetting.destIP = destIp;
  mypax.poslink.commSetting.destPort = portDevice;
  mypax.poslink.commSetting.timeout = timeoutConnect;
  mypax.poslink.commSetting.bluetoothAddr = bluetoothAddr;
//  myapp.poslink.commSetting.bluetoothAddr = @"8451A339-09C8-982C-B4AD-7AEAB9C4A86E";
  
   [self saveSetupSetting];
}


@end
