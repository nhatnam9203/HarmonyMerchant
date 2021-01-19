//
//  ExtDataPaymentReq.h
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 8/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ExtDataPaymentReq : NSObject
{
  NSString * displayName;
  NSArray<NSString*> *keyArray;
  NSMutableDictionary *dataDict;
}

@property(nonatomic, strong)NSString *displayName;
@property(nonatomic, strong)NSArray *keyArray;
@property(nonatomic, strong)NSMutableDictionary *dataDict;

- (id)initWithName:(NSString*)name Keys:(NSArray*)keys;
-(void) clearValues;
@end

