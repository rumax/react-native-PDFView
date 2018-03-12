#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "PDFConstants.h"

@interface PDFView : RCTView <UIWebViewDelegate>

@property (nonatomic, copy) NSString *resource;
@property (nonatomic, copy) NSString *resourceType;
@property (nonatomic, copy) NSString *textEncoding;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onError;

- (BOOL)isRequiredInputSet;
- (BOOL)isSupportedResourceType;
- (BOOL)isURLResource;
- (BOOL)isBase64Resource;

@end

