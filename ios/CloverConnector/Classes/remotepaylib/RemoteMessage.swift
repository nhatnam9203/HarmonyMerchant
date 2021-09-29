/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

import Foundation
import ObjectMapper




/*
 The base class for messages being sent to a clover device
 */
public class RemoteMessage:Mappable {
    
    /*
     * Identifier for the request
     */
    var requestId:String? = nil
    /*
     * Message package name
     */
    public var packageName:String? = nil
    /*
     * string representation of the message being wrapped by this RemoteMessage
     */
    public var id:String? = nil
    public var payload:String? = nil
    public var type:RemoteMessageType? = nil
    public var method:Method? = nil
    public var version:Int = 1
    public var remoteSourceSDK = ""
    public var remoteApplicationID = ""
    public var fragmentIndex:Int?
    public var lastFragment:Bool?
    public var attachment:String?
    public var attachmentUri:String?
    public var attachmentEncoding:String?
    public var remotePayCompatibilityVersion: Int = 1
    
    public required init() {
        
    }
    
    required public init?(map:Map) {
        payload = map["payload"].currentValue as? String
        method = map["method"].currentValue as? Method
    }
    
    public func mapping(map:Map) {
        
        remoteSourceSDK <- map["remoteSourceSDK"]
        
        remoteApplicationID <- map["remoteApplicationID"]
        
        version <- map["version"]
        
        method <- (map["method"], Message.methodTransform)
        
        requestId <- map["requestId"]
        
        packageName <- map["packageName"]
        
        payload <- map["payload"]
        
        type <- map["type"]
        id <- map["id"]
        
        fragmentIndex <- map["fragmentIndex"]
        lastFragment <- map["lastFragment"]
        attachment <- map["attachment"]
        
        attachmentUri <- map["attachmentUri"]
        attachmentEncoding <- map["attachmentEncoding"]
        
        remotePayCompatibilityVersion <- map["remotePayCompatibilityVersion"]
    }
}

