//
//  clover.h
//  Hpmerchant
//
//  Created by Duyen Hang on 13/08/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#ifndef clover_h
#define clover_h

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "Hpmerchant_Dev-Swift.h"
#import <React/RCTEventEmitter.h>

@interface clover : RCTEventEmitter <RCTBridgeModule, CloverManagerDelegate>


@end

#endif /* clover_h */
