#import "RNPDFView.h"

@implementation RNPDFView
{
    WKWebView *webview;
    NSString *currentResource;
    NSString *currentResourceType;
    NSString *currentFileFrom;
    bool didLoadOnce; // Needed as on init, didSetProps is called as well, leading to layoutSubviews being called twice
    bool ignoreScrollEvent;
    float lastOffset;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
    if (didLoadOnce) {
        [self layoutSubviews];
    }
}

- (instancetype)init {
    self = [super init];
    lastOffset = 0;
    ignoreScrollEvent = true;
    if ( self ) {
        [self setBackgroundColor: [UIColor clearColor]];

        webview = [[WKWebView alloc] initWithFrame: self.frame];
        [webview setNavigationDelegate: self];
        [webview.scrollView setDelegate: self];
        [self addSubview: webview];
    }
    return self;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (ignoreScrollEvent) {
        return;
    }
    // currently only offset 0 and 1 are supported
    if (lastOffset != 0 && scrollView.contentOffset.y <= 0.0){
        lastOffset = 0;
        [self reportOnScroll];
    } else if (lastOffset != 1 && scrollView.contentOffset.y >=
              (scrollView.contentSize.height - scrollView.frame.size.height)){
        lastOffset = 1;
        [self reportOnScroll];
    }

}

- (void)reportOnScroll {
    if (_onScrolled) {
        _onScrolled(@{ @"offset": [NSNumber numberWithFloat:(float) lastOffset] });
    }
}

- (void)reload {
    [self renderContent];
}

- (void)layoutSubviews {
    [super layoutSubviews];

    webview.frame = self.bounds;
    didLoadOnce = true;

    if (![self isNewInput]) {
        return;
    }

    [self renderContent];
}

- (void)renderContent {
    [webview setAlpha: 0.0];

    if (![self isRequiredInputSet]) {
        return;
    }

    [self updateInput];

    if (![self isSupportedResourceType]) {
        [self throwError: ERROR_UNSUPPORTED_TYPE withMessage: [NSString stringWithFormat: @"resourceType: %@ not recognized", _resourceType]];
        return;
    }

    ignoreScrollEvent = true;

    if ([self isURLResource]) {
        NSURLRequest *request = [self createRequest];
        if (request) {
            [webview loadRequest: request];
        }
    } else if ([self isFileResource]) {
        NSURL *fileURL = [self getFileURL];
        if (fileURL == nil) {
            [self throwError: ERROR_ONLOADING withMessage: ERROR_MESSAGE_FILENOTFOUND];
            return;
        }

        [webview loadFileURL: fileURL allowingReadAccessToURL: fileURL];
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

- (NSURL *)getFileURL {
    NSURL *url;
    if ([currentFileFrom isEqualToString:@"bundle"]) {
        url = [self fileFromBundleURL];
    } else if ([currentFileFrom isEqualToString:@"documentsDirectory"]) {
        url = [self fileFromDirectoryURL:NSDocumentDirectory];
    } else if ([currentFileFrom isEqualToString:@"libraryDirectory"]) {
        url = [self fileFromDirectoryURL:NSLibraryDirectory];
    } else if ([currentFileFrom isEqualToString:@"tempDirectory"]) {
        url = [self fileFromDirectoryPath:NSTemporaryDirectory()];
    } else { // default is search
        url = [self fileFromBundleURL];
        if (url == nil) {
            // default directory is Documents
            url = [self fileFromDirectoryURL:NSDocumentDirectory];
        }
    }

    return url;
}

- (NSMutableURLRequest *)createRequest {
    NSURL *URL = [NSURL URLWithString: _resource];
    NSString *scheme = URL.scheme;

    if ([HTTP_PROTOCOL caseInsensitiveCompare: scheme] != NSOrderedSame &&
        [HTTPS_PROTOCOL caseInsensitiveCompare: scheme] != NSOrderedSame &&
        [FILE_PROTOCOL caseInsensitiveCompare: scheme] != NSOrderedSame) {
        [self throwError: ERROR_ONLOADING withMessage: [NSString stringWithFormat:@"Protocol %@ is not supported", scheme]];
        return nil;
    }

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL: URL
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
    currentFileFrom = _fileFrom;
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler {
    
    if ([navigationResponse.response isKindOfClass:[NSHTTPURLResponse class]]) {
        NSHTTPURLResponse * response = (NSHTTPURLResponse *)navigationResponse.response;

        if (![self isResponseSuccess:response]) {
            decisionHandler(WKNavigationResponsePolicyCancel);
            [self throwError: ERROR_NETWORK_ERROR withMessage: [NSString stringWithFormat: @"resource %@ in unreachable, statusCode %ld", _resource, response.statusCode]];
            return;
        }
    }
    decisionHandler(WKNavigationResponsePolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    [UIView animateWithDuration: _fadeInDuration animations: ^(void) {
        [webview setAlpha: 1.0];
    }];

    if (_onLoad) {
        _onLoad(nil);
    }

    ignoreScrollEvent = false;
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    [self throwError: ERROR_ONLOADING withMessage: error.localizedDescription];
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
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

- (NSURL *)fileFromDirectoryURL:(NSSearchPathDirectory)directory {
    NSString *directoryPath = [NSSearchPathForDirectoriesInDomains(directory, NSUserDomainMask, YES) lastObject];

    return [self fileFromDirectoryPath:directoryPath];
}

- (NSURL *)fileFromDirectoryPath:(NSString *)directoryPath {
    if (directoryPath == nil) {
        return nil;
    }
    NSString *filePath = [directoryPath stringByAppendingPathComponent: _resource];
    if(![[NSFileManager defaultManager] fileExistsAtPath: filePath]) {
        return nil;
    }
    return [NSURL fileURLWithPath: filePath];
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
    return ![_resource isEqualToString: currentResource] ||
        ![_resourceType isEqualToString: currentResourceType] ||
        ![_resourceType isEqualToString: currentFileFrom];
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

- (BOOL)isResponseSuccess: (NSHTTPURLResponse *)response {
    return response.statusCode >= 200 && response.statusCode <= 299;
}

- (void)throwError: (NSString *)title withMessage:(NSString *)message {
    if (_onError) {
        _onError(@{
                   ERROR_MESSAGE_KEY: message,
                   ERROR_MESSAGE_TITLE: title,
                   });
    }
}

@end
