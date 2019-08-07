//
//  PosLink.h
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 8/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PosLink.h"
#import "ExtDataPaymentReq.h"
#import <React/RCTBridgeModule.h>


@interface MyApp : NSObject <RCTBridgeModule>

{
  NSMutableArray *PaymentReqExtData;
}

@property(nonatomic, strong)NSMutableArray *PaymentReqExtData;

@property(nonatomic, strong)PosLink *poslink;

+ (MyApp*)sharedSigleton;

- (void)clearPaymentReqExtData;

- (void)save;

@end
