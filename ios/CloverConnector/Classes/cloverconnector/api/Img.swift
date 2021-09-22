/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */

import Foundation
import ObjectMapper



/// :nodoc:
public class Img:Mappable {

  /*
  * The url to the image if available
   */
  var src:String? = nil 
  /*
  * The width of the image if available
   */
  var width:Int? = nil 
  /*
  * The height of the image if available
   */
  var height:Int? = nil 

  public required init() {

  }

  required public init?(map:Map) {
  }

  public func mapping(map:Map) {
  src <- map["src"]

  width <- map["width"]

  height <- map["height"]

  }
}

