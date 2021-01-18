//
//  MyPax.h
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#ifndef MyPax_h
#define MyPax_h

#import <Foundation/Foundation.h>
#import "PosLink.h"
#import "ExtDataPaymentReq.h"

@interface MyPax : NSObject

{
  NSMutableArray *PaymentReqExtData;
}

@property(nonatomic, strong)NSMutableArray *PaymentReqExtData;

@property(nonatomic, strong)PosLink *poslink;

+ (MyPax*)sharedSigleton;

- (void)clearPaymentReqExtData;

@end


#endif /* MyPax_h */
