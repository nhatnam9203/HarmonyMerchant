//
//  log.m
//  Hpmerchant
//
//  Created by Trần Hoàng Nhã on 9/10/21.
//  Copyright © 2021 Facebook. All rights reserved.
//
#import "logPax.h"

#import <Foundation/Foundation.h>
#import "LogManager.h"

#define keyLogFileName @"logFileName"
#define keyLogDays @"logDays"
#define keyLogFilePath @"logFilePath"

@implementation logPax

- (NSString*) convertObjectToJson:(NSObject*) object
{
  NSError *writeError = nil;
  
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object options:NSJSONWritingPrettyPrinted error:&writeError];
  NSString *result = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  return result;
}

- (void)load {

    id idTemp;

    NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
  NSLog(@"+++++++=====XXXX===> %@", settings);
  NSLog(@"%@", [[NSUserDefaults standardUserDefaults] dictionaryRepresentation]);


    LogManager *logManager = [LogManager sharedInstance];

    if ((idTemp = [settings objectForKey:keyLogFileName]) != nil) {
        logManager.logFileName = (NSString *)idTemp;
    }

    if ((idTemp = [settings objectForKey:keyLogDays]) != nil) {
        logManager.logDays = [(NSNumber*)idTemp intValue];
    }

    if ((idTemp = [settings objectForKey:keyLogFilePath]) != nil) {
        logManager.logFilePath = (NSString *)idTemp;
      NSLog(@"+++++++=====XXXX===> %@", idTemp);

    }
}

- (void)save {

    NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];

    LogManager *logManager = [LogManager sharedInstance];

    if (logManager.logFileName != nil && logManager.logFileName.length > 0){
        [settings setObject:logManager.logFileName forKey:keyLogFileName];
    }

    if (logManager.logDays > 0){
        [settings setObject:[NSNumber numberWithInt:logManager.logDays] forKey:keyLogDays];
    }

    if (logManager.logFileName != nil && logManager.logFileName.length > 0){
        [settings setObject:logManager.logFilePath forKey:keyLogFilePath];
    }

    [settings synchronize];
}


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loadLogPax) {
  @try {
    LogManager *manager = [LogManager sharedInstance];
        NSDictionary *defaults = @{
                                   keyLogFileName: @"POSLog",
                                   keyLogDays:[NSNumber numberWithInt:30],
                                   keyLogFilePath:@"POSLogPath",
                                   };
    [[NSUserDefaults standardUserDefaults] registerDefaults:defaults];
    [self load];

    [manager setLogLevel:0];
    [manager startLog];
//    NSLog(@"+++++++=====XXXX===> %@", manager.logFilePath);

  } @catch (id e) {
    NSLog(@"+++++++=====XXXX===> %@", e);

  }
 

}

RCT_EXPORT_METHOD(readLogPax:(NSString *)dateStr callback:(RCTResponseSenderBlock) callback) {
  NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
  [dateFormat setDateFormat:@"yyyy-MM-dd"];
  NSDate *date = [dateFormat dateFromString:dateStr];

  
  NSString* log =  [[LogManager sharedInstance] readLog:date];
  callback(@[log]);
}

@end
