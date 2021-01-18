//
//  payment.h
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#ifndef payment_h
#define payment_h

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "MyPax.h"
#import "PaymentRequest.h"

typedef void(^MutiplePaymentBlock)(PaymentRequest *model);
@interface payment : NSObject <RCTBridgeModule>

@property (nonatomic, strong) MyPax *mypax;

- (void)load;
- (void)save;

@end

#endif /* payment_h */
