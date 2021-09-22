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

RCT_EXPORT_MODULE();

- (void)load {

    id idTemp;

    NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];

    LogManager *logManager = [LogManager sharedInstance];

    if ((idTemp = [settings objectForKey:keyLogFileName]) != nil) {
        logManager.logFileName = (NSString *)idTemp;
    }

    if ((idTemp = [settings objectForKey:keyLogDays]) != nil) {
        logManager.logDays = [(NSNumber*)idTemp intValue];
    }

    if ((idTemp = [settings objectForKey:keyLogFilePath]) != nil) {
        logManager.logFilePath = (NSString *)idTemp;

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



RCT_EXPORT_METHOD(loadLogPax) {
  @try {

    LogManager *manager = [LogManager sharedInstance];

    [manager setLogLevel:4];
    manager.logFileName = @"POSLog";
    manager.logFilePath = @"POSLogPath";
    manager.logDays = 30;

    [manager startLog];
    


  } @catch (NSException* e) {
    NSLog(@"+++++++=====XXXX===> %@", e);
  }
}

RCT_EXPORT_METHOD(readLogPax:(NSDictionary *)info callback:(RCTResponseSenderBlock) callback){

  @try {
    LogManager *manager = [LogManager sharedInstance];

//    [manager writeLog:@"test 2 log"];
  

    NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setDateFormat:@"yyyy-MM-dd"];
    NSDate *date = [dateFormat dateFromString:(NSString *) info[@"dateStr"]];
    
    NSString* log =  [manager readLog:date];

    callback(@[log]);
  } @catch (NSException *exception) {
    NSLog(@"+++++++=====XXXX===> readLogPax %@", exception);
  }
}


@end
