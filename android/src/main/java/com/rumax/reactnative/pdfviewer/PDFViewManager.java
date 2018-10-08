package com.rumax.reactnative.pdfviewer;

/*
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.view.ViewGroup;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

public class PDFViewManager extends SimpleViewManager<PDFView> {
    private static final String REACT_CLASS = "PDFView";
    private PDFView pdfView = null;
    private final static String EVENT_BUBBLED = "bubbled";

    @SuppressWarnings("unused")
    PDFViewManager(ReactApplicationContext context) {}

    @Nullable @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        PDFView.EVENT_ON_LOAD,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_LOAD)
                        )
                )
                .put(
                        PDFView.EVENT_ON_ERROR,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_ERROR)
                        )
                )
                .put(
                        PDFView.EVENT_ON_PAGE_CHANGED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_PAGE_CHANGED)
                        )
                )
                .build();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public PDFView createViewInstance(ThemedReactContext context) {
        if (pdfView != null) {
            ViewGroup parentView = (ViewGroup) pdfView.getParent();
            if (parentView != null) {
                pdfView.onDrop();
                parentView.removeView(pdfView);
            }
        }

        pdfView = new PDFView(context);

        return pdfView;
    }

    @Override
    public void onDropViewInstance(PDFView pdfView) {
        pdfView.onDrop();
        this.pdfView = null;
    }

    @ReactProp(name = "resource")
    public void setResource(PDFView pdfView, String resource) {
        pdfView.setResource(resource);
    }

    @ReactProp(name = "resourceType")
    public void setResourceType(PDFView pdfView, String resourceType) {
        pdfView.setResourceType(resourceType);
    }

    @ReactProp(name = "textEncoding")
    public void setTextEncoding(PDFView pdfView, String textEncoding) {
    }

    @ReactProp(name = "urlProps")
    public void setUrlProps(PDFView pdfView, final ReadableMap props) {
        pdfView.setUrlProps(props);
    }

    @ReactProp(name = "fadeInDuration")
    public void setFadeInDuration(PDFView pdfView, int duration) {
        pdfView.setFadeInDuration(duration);
    }

    @Override
    public void onAfterUpdateTransaction(PDFView pdfView) {
        super.onAfterUpdateTransaction(pdfView);
        pdfView.render();
    }
}
