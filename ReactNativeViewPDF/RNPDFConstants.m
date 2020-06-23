#import "RNPDFConstants.h"

NSString *const UTF_8 = @"utf-8";
NSString *const UTF_16 = @"utf-16";
NSString *const RESOURCE_TYPE_URL = @"url";
NSString *const RESOURCE_TYPE_BASE64 = @"base64";
NSString *const RESOURCE_TYPE_FILE = @"file";
NSString *const MIMETYPE_PDF = @"application/pdf";
NSString *const HTTP_METHOD_GET = @"GET";

// Url Props
NSString *const URL_PROPS_METHOD_KEY = @"method";
NSString *const URL_PROPS_HEADERS_KEY = @"headers";
NSString *const URL_PROPS_BODY_KEY = @"body";

// Supported protocols
NSString *const HTTP_PROTOCOL = @"http";
NSString *const HTTPS_PROTOCOL = @"https";
NSString *const FILE_PROTOCOL = @"file";

// Error types
NSString *const ERROR_UNSUPPORTED_TYPE = @"Unsupported resourceType";
NSString *const ERROR_NETWORK_ERROR = @"Network error";
NSString *const ERROR_ONLOADING = @"Error occured while loading content in webview";
NSString *const ERROR_REQUIRED_INPUT_NOT_SET = @"Validation failed. Confirm resource and resourceType have a value";
NSString *const ERROR_INVALID_REACT_TAG = @"Invalid react tag";

// Error messages
NSString *const ERROR_MESSAGE_KEY = @"message";
NSString *const ERROR_MESSAGE_TITLE = @"title";
NSString *const ERROR_MESSAGE_BASE64_NIL = @"Converted Base64 data is nil";
NSString *const ERROR_MESSAGE_FILENOTFOUND = @"PDF file not found";
