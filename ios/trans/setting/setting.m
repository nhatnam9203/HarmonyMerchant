//
//  setting.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "setting.h"
#import "CommSetting.h"
#import "MyPax.h"

#define keyCommType @"commType"
#define keyTimeout @"timeout"
#define keySerialPort @"serialPort"
#define keyDestIP @"destIP"
#define keyDestPort @"destPort"
#define keyBluetoothAddr @"bluetoothAddr"

@implementation setting

- (void)save {
  
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

RCT_EXPORT_METHOD(setupPax:
                  (NSString *)commType
                  destIp:(NSString *)destIp
                  portDevice:(NSString *)portDevice
                  timeoutConnect:(NSString *)timeoutConnect
                  bluetoothAddr:(NSString *)bluetoothAddr
                  )
{
  MyPax *mypax = [MyPax sharedSigleton];
// commType = @"TCP", @"BLUETOOTH";
  mypax.poslink.commSetting.commType = commType;
  mypax.poslink.commSetting.destIP = destIp;
  mypax.poslink.commSetting.destPort = portDevice;
  mypax.poslink.commSetting.timeout = timeoutConnect;
  mypax.poslink.commSetting.bluetoothAddr = bluetoothAddr;
  
   [self save];
}

@end

