#import <React/RCTView.h>
#import "RNPDFConstants.h"
#import <WebKit/WebKit.h>

@interface RNPDFView : RCTView <WKNavigationDelegate, UIScrollViewDelegate>

@property (nonatomic, copy) NSString *resource;
@property (nonatomic, copy) NSString *resourceType;
@property (nonatomic, copy) NSString *fileFrom;
@property (nonatomic, copy) NSString *textEncoding;
@property (nonatomic, copy) NSDictionary *urlProps;
@property (nonatomic) NSTimeInterval fadeInDuration;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onError;
@property (nonatomic, copy) RCTDirectEventBlock onScrolled;

- (BOOL)isRequiredInputSet;
- (BOOL)isSupportedResourceType;
- (BOOL)isURLResource;
- (BOOL)isBase64Resource;

- (void)reload;

@end
