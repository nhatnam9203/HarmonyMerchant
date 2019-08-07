//
//  ExtDataPaymentReq.m
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 8/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "ExtDataPaymentReq.h"

@implementation ExtDataPaymentReq
@synthesize displayName, keyArray, dataDict;

- (id)initWithName:(NSString*)name Keys:(NSArray*)keys
{
  self = [super init];
  self.displayName = name;
  self.keyArray = keys;
  self.dataDict = [NSMutableDictionary dictionary];
  [self clearValues];
  
  return self;
}

-(void) clearValues
{
  for(NSString * key in self.keyArray)
  {
    [dataDict setObject:@"" forKey:key];
  }
}

@end
