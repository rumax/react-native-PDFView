package com.reactlibrary;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.github.barteksc.pdfviewer.PDFView;
import com.github.barteksc.pdfviewer.listener.OnErrorListener;
import com.github.barteksc.pdfviewer.listener.OnLoadCompleteListener;
import com.github.barteksc.pdfviewer.util.FitPolicy;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class ViewPdf extends PDFView implements
        OnLoadCompleteListener,
        OnErrorListener,
        AsyncTaskCompleted {
    private ThemedReactContext context;
    private String resource;

    private File pdfFile;
    private AsyncDownload asyncDownload = null;

    public ViewPdf(ThemedReactContext context) {
        super(context, null);
        this.context = context;
    }

    private void reactNativeEvent(String eventName, String message) {
        WritableMap event = Arguments.createMap();
        event.putString("message", message);
        ReactContext reactContext = (ReactContext) this.getContext();
        reactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(this.getId(), eventName, event);
    }

    @Override
    public void loadComplete(int numberOfPages) {
        reactNativeEvent("onLoad", null);
    }

    @Override
    public void onError(Throwable t) {
        reactNativeEvent("onError", "error: " + t.getMessage());
    }

    @Override
    public void downloadTaskFailed(IOException e) {
        pdfFile.delete();
        pdfFile = null;
        onError(e);
    }

    private void setupAndLoad(Configurator configurator) {
        configurator
                .defaultPage(0)
                .swipeHorizontal(false)
                .onLoad(this)
                .onError(this)
                .spacing(10)
                .pageFitPolicy(FitPolicy.WIDTH)
                .load();
    }

    @Override
    public void downloadTaskCompleted() {
        InputStream input;
        try {
            input = new FileInputStream(pdfFile);
            setupAndLoad(this.fromStream(input));
        } catch (FileNotFoundException e) {
            onError(e);
        }
        asyncDownload = null;
    }

    public void renderFromBase64() {
        byte[] bytes = Base64.decode(resource.replace("base64:", ""), 0);
        setupAndLoad(this.fromBytes(bytes));
    }

    public void renderFromUrl() {
        File dir = context.getCacheDir();
        try {
            pdfFile = File.createTempFile("pdfDocument", "pdf", dir);
        } catch (IOException e) {
            onError(e);
            return;
        }

        asyncDownload = new AsyncDownload(resource, pdfFile, this);
        asyncDownload.execute();
    }

    public void renderPdf() {
        cleanup();

        if (resource == null) {
            onError(new IOException("Cannot render PDF, source is undefined"));
            return;
        }

        if (resource.startsWith("base64")) {
            renderFromBase64();
            return;
        }

        renderFromUrl();
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    private void cleanup() {
        if (asyncDownload != null) {
            asyncDownload.cancel(true);
        }
        if (pdfFile != null) {
            pdfFile.delete();
            pdfFile = null;
        }
    }

    public void onDrop() {
        cleanup();
    }
}
