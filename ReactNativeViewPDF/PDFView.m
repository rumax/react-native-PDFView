#import "PDFView.h"

@implementation PDFView
{
    UIWebView *webview;
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
        webview = [[UIWebView alloc] initWithFrame: self.frame];
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
    
    if (![self isSupportedResourceType]) {
        if (_onError) {
            _onError(@{
                       MESSAGE_UNSUPPORTED_TYPE: @{
                               MESSAGE_KEY_RESOURCETYPE: _resourceType,
                               }
                       });
        }
        return;
    }
    
    
    if ([self isURLResource]) {
        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString: _resource]];
        [webview loadRequest: request];
    } else {
        NSString *textEncodingName = [_textEncoding isEqual: UTF_16] ? UTF_16 : UTF_8;
        NSData *base64Decoded = [[NSData alloc] initWithBase64EncodedString: _resource options: NSDataBase64DecodingIgnoreUnknownCharacters];
        [webview loadData: base64Decoded MIMEType: MIMETYPE_PDF textEncodingName: textEncodingName baseURL: [[NSURL alloc] init]];
    }
    
    [webview setScalesPageToFit: YES];
    [webview setDelegate: self];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    if (_onLoad) {
        _onLoad(nil);
    }
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    if (_onError) {
        _onError(@{
                   MESSAGE_ERROR_ONLOADING: @{
                           MESSAGE_KEY_ERRORMESSAGE: error.localizedDescription,
                           }
                   });
    }
}

- (BOOL) isRequiredInputSet {
    if ([_resource length] == 0 || [_resourceType length] == 0) {
        if (_onError) {
            _onError(@{
                       MESSAGE_REQUIRED_INPUT_NOT_SET: @{
                               MESSAGE_KEY_RESOURCE: _resource == nil ? @"" : _resource,
                               MESSAGE_KEY_RESOURCETYPE: _resourceType == nil ? @"" : _resourceType,
                               }
                       });
        }
        return NO;
    }
    return YES;
}

- (BOOL) isNewInput {
    return ![_resource isEqualToString: currentResource] || ![_resourceType isEqualToString: currentResourceType];
}

- (BOOL) isSupportedResourceType {
    return [self isURLResource] || [self isBase64Resource];
}

- (BOOL) isURLResource {
    return [_resourceType  isEqualToString: RESOURCE_TYPE_URL];
}

- (BOOL) isBase64Resource {
    return [_resourceType  isEqualToString: RESOURCE_TYPE_BASE64];
}

@end

