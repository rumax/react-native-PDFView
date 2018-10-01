#import "PDFView.h"

@implementation PDFView
{
    WKWebView *webview;
    NSString *currentResource;
    NSString *currentResourceType;
    bool didLoadOnce; // Needed as on init, didSetProps is called as well, leading to layoutSubviews being called twice
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
    if (didLoadOnce) {
        [self layoutSubviews];
    }
}

- (instancetype)init {
    self = [super init];
    if ( self ) {
        [self setBackgroundColor: [UIColor clearColor]];
        
        webview = [[WKWebView alloc] initWithFrame: self.frame];
        [webview setNavigationDelegate: self];
        [self addSubview: webview];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    webview.frame = self.bounds;
    didLoadOnce = true;
    
    if (![self isNewInput]) {
        return;
    }
    
    if (![self isRequiredInputSet]) {
        return;
    }
    [self updateInput];
    
    if (![self isSupportedResourceType]) {
        [self throwError: ERROR_UNSUPPORTED_TYPE withMessage: [NSString stringWithFormat: @"resourceType: %@ not recognized", _resourceType]];
        return;
    }
    
    [webview setAlpha: 0.0];
    
    if ([self isURLResource]) {
        [webview loadRequest: [self createRequest]];
    } else if ([self isFileResource]) {
        NSURL *targetURL = [self fileFromBundleURL];
        if (targetURL == nil) {
            targetURL = [self fileFromDocumentsDirectoryURL];
        }
        if (targetURL == nil) {
            [self throwError: ERROR_ONLOADING withMessage: ERROR_MESSAGE_FILENOTFOUND];
            return;
        }
        
        [webview loadFileURL: targetURL allowingReadAccessToURL: targetURL];
    } else {
        NSString *characterEncodingName = [_textEncoding isEqual: UTF_16] ? UTF_16 : UTF_8;
        NSData *base64Decoded = [[NSData alloc] initWithBase64EncodedString: _resource options: NSDataBase64DecodingIgnoreUnknownCharacters];
        if (base64Decoded != nil) {
            [webview loadData: base64Decoded MIMEType: MIMETYPE_PDF characterEncodingName: characterEncodingName baseURL: [[NSURL alloc] init]];
        } else {
            [self throwError: ERROR_ONLOADING withMessage: ERROR_MESSAGE_BASE64_NIL];
        }
    }
}

- (NSMutableURLRequest *)createRequest {
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL: [NSURL URLWithString: _resource]
                                                           cachePolicy: NSURLRequestUseProtocolCachePolicy
                                                       timeoutInterval: 60.0];
    if (_urlProps != nil) {
        [self enrichRequestWithUrlProps: request];
    }
    
    return request;
}

- (void)enrichRequestWithUrlProps: (NSMutableURLRequest *) request {
    NSString* method = [_urlProps objectForKey: URL_PROPS_METHOD_KEY];
    NSString* body = [_urlProps objectForKey: URL_PROPS_BODY_KEY];
    NSDictionary* headers = [_urlProps objectForKey: URL_PROPS_HEADERS_KEY];
    
    if (method != nil) {
        [request setHTTPMethod: method];
    }
    if (body != nil) {
        [request setHTTPBody: [body dataUsingEncoding: NSUTF8StringEncoding]];
    }
    if (headers != nil) {
        for (id key in headers) {
            [request setValue: [headers objectForKey: key] forHTTPHeaderField: key];
        }
    }
}

- (void)updateInput {
    currentResourceType = _resourceType;
    currentResource = _resource;
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    [UIView animateWithDuration: _fadeInDuration animations: ^(void) {
        [webview setAlpha: 1.0];
    }];
    
    if (_onLoad) {
        _onLoad(nil);
    }
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    [self throwError: ERROR_ONLOADING withMessage: error.localizedDescription];
}

- (NSURL *)fileFromBundleURL {
    NSString *resourcePath = [_resource stringByReplacingOccurrencesOfString: @".pdf" withString: @""]; // Remove pdf extension from path if present
    if (![[NSBundle mainBundle] pathForResource: resourcePath ofType: @"pdf"]) {
        return nil;
    } else {
        return [NSURL fileURLWithPath: [[NSBundle mainBundle] pathForResource: resourcePath ofType: @"pdf"]];
    }
}

- (NSURL *)fileFromDocumentsDirectoryURL {
    NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    if (documentsDirectory == nil) {
        return nil;
    }
    NSString *filePath = [documentsDirectory stringByAppendingPathComponent: _resource];
    if(![[NSFileManager defaultManager] fileExistsAtPath: filePath]) {
        return nil;
    }
    return [NSURL fileURLWithPath:filePath];
}

- (BOOL)isRequiredInputSet {
    if ([_resource length] == 0 || [_resourceType length] == 0) {
        NSString* errorMessage = [NSString stringWithFormat: @"resource: %@. resourceType: %@.", _resource, _resourceType];
        [self throwError: ERROR_REQUIRED_INPUT_NOT_SET withMessage: errorMessage];
        return NO;
    }
    return YES;
}

- (BOOL)isNewInput {
    return ![_resource isEqualToString: currentResource] || ![_resourceType isEqualToString: currentResourceType];
}

- (BOOL)isSupportedResourceType {
    return [self isURLResource] || [self isBase64Resource] || [self isFileResource];
}

- (BOOL)isURLResource {
    return [_resourceType  isEqualToString: RESOURCE_TYPE_URL];
}

- (BOOL)isBase64Resource {
    return [_resourceType  isEqualToString: RESOURCE_TYPE_BASE64];
}

- (BOOL)isFileResource {
    return [_resourceType  isEqualToString: RESOURCE_TYPE_FILE];
}

- (void)throwError: (NSString *)title withMessage:(NSString *)message {
    if (_onError) {
        _onError(@{
                   title: @{
                           ERROR_MESSAGE_KEY: message,
                           }
                   });
    }
}

@end
