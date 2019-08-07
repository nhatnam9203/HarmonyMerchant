//
//  PosLink.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 8/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PosLink.h"

@implementation PosLink

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getSomething:(RCTResponseSenderBlock)callback)
{
  NSString* someString = @"Hello Phi";
  callback(@[someString]);
  
}

@end
