//
//  Device.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 14/04/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "Device.h"

@implementation Device
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(deviceName:(RCTResponseSenderBlock)callback) {
  NSString *deviceName = [[UIDevice currentDevice] name];
  callback(@[deviceName]);
}
@end
