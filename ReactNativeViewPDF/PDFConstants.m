#import "PDFConstants.h"

NSString *const UTF_8 = @"utf-8";
NSString *const UTF_16 = @"utf-16";
NSString *const RESOURCE_TYPE_URL = @"url";
NSString *const RESOURCE_TYPE_BASE64 = @"base64";
NSString *const MIMETYPE_PDF = @"application/pdf";

NSString *const MESSAGE_UNSUPPORTED_TYPE = @"Unsupported resourceType";
NSString *const MESSAGE_ERROR_ONLOADING = @"Error occured while loading content in webview";
NSString *const MESSAGE_ERROR_BASE64 = @"Converted Base64 data is nil";
NSString *const MESSAGE_REQUIRED_INPUT_NOT_SET = @"Validation failed. Confirm resource and resourceType have a value";

NSString *const MESSAGE_KEY_RESOURCE = @"resource";
NSString *const MESSAGE_KEY_RESOURCETYPE = @"resourceType";
NSString *const MESSAGE_KEY_ERRORMESSAGE = @"errorMessage";
