package com.reactlibrary;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import java.util.Map;

public class PdfViewManager extends SimpleViewManager<PdfView> {
    private static final String REACT_CLASS = "PdfView";
    private Context context;
    private PdfView pdfView = null;

    public PdfViewManager(ReactApplicationContext context) {
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
    public PdfView createViewInstance(ThemedReactContext context) {
        if (pdfView != null) {
          pdfView.onDrop();
        }
        pdfView = new PdfView(context);
        return pdfView;
    }

    @Override
    public void onDropViewInstance(PdfView pdfView) {
        pdfView.onDrop();
    }

    @ReactProp(name = "resource")
    public void setResource(PdfView pdfView, String resource) {
        pdfView.setResource(resource);
    }

    @Override
    public void onAfterUpdateTransaction(PdfView pdfView) {
        super.onAfterUpdateTransaction(pdfView);

        pdfView.renderPdf();
    }
}
