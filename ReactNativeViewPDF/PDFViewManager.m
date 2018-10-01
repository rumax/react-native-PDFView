#import "PDFViewManager.h"

@implementation PDFViewManager

RCT_EXPORT_MODULE()

RCT_CUSTOM_VIEW_PROPERTY(resource, NSString, PDFView) {
    [view setResource: json ? [RCTConvert NSString: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(resourceType, NSString, PDFView) {
    [view setResourceType: json ? [RCTConvert NSString: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(textEncoding, NSString, PDFView) {
    [view setTextEncoding: json ? [RCTConvert NSString: json] : UTF_8];
}

RCT_CUSTOM_VIEW_PROPERTY(urlProps, NSDictionary, PDFView) {
    [view setUrlProps: json ? [RCTConvert NSDictionary: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(fadeInDuration, NSTimeInterval, PDFView) {
    [view setFadeInDuration: json ? [RCTConvert NSTimeInterval: json] : 0.0];
}

RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)

- (instancetype)init {
    self = [super init];
    return self;
}

- (UIView *)view {
    self.pdfView = [[PDFView alloc] init];
    return self.pdfView;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end
