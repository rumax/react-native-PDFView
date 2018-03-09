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

RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)

- (instancetype)init {
  self = [super init];
  if ( self ) {
    self.pdfView = [[PDFView alloc] init];
  }
  return self;
}

- (UIView *)view {
  return self.pdfView;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
