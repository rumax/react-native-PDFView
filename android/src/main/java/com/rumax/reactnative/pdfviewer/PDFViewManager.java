package com.rumax.reactnative.pdfviewer;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.content.Context;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import java.util.Map;

public class PDFViewManager extends SimpleViewManager<PDFView> {
    private static final String REACT_CLASS = "PDFView";
    private Context context;
    private PDFView pdfView = null;

    public PDFViewManager(ReactApplicationContext context) {
        this.context = context;
    }

    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder
                .builder()
                .put(
                        "onLoad",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onLoad")
                        )
                )
                .put(
                        "onError",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onError")
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
        pdfView.setTextEncoding(textEncoding);
    }

    @ReactProp(name = "urlProps")
    public void setUrlProps(PDFView pdfView, final ReadableMap props) {
        pdfView.setUrlProps(props);
    }

    @Override
    public void onAfterUpdateTransaction(PDFView pdfView) {
        super.onAfterUpdateTransaction(pdfView);
        pdfView.render();
    }
}
