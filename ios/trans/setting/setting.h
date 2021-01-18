//
//  setting.h
//  Hpmerchant
//
//  Created by Nguyễn Hoàng Nhật Phi on 18/01/2021.
//  Copyright © 2021 Facebook. All rights reserved.
//

#ifndef setting_h
#define setting_h

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface setting : NSObject <RCTBridgeModule>

- (void)save;

@end

#endif /* setting_h */


