#import <React/RCTView.h>
#import "PDFConstants.h"
#import <WebKit/WebKit.h>

@interface PDFView : RCTView <WKNavigationDelegate>

@property (nonatomic, copy) NSString *resource;
@property (nonatomic, copy) NSString *resourceType;
@property (nonatomic, copy) NSString *textEncoding;
@property (nonatomic, copy) NSDictionary *urlProps;
@property (nonatomic) NSTimeInterval fadeInDuration;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onError;

- (BOOL)isRequiredInputSet;
- (BOOL)isSupportedResourceType;
- (BOOL)isURLResource;
- (BOOL)isBase64Resource;

@end
