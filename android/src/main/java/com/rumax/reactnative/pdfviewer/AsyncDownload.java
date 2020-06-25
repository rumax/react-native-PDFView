package com.rumax.reactnative.pdfviewer;

/*
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

class AsyncDownload extends AsyncTask<Void, Void, Void> {
    public static final String HTTP = "http";
    public static final String HTTPS = "https";
    public static final String CONTENT = "content";
    private static final int BUFF_SIZE = 8192;
    private static final String PROP_METHOD = "method";
    private static final String PROP_BODY = "body";
    private static final String PROP_HEADERS = "headers";
    private final ReadableMap urlProps;
    private Context context;
    private TaskCompleted listener;
    private File file;
    private String url;
    private Exception exception;

    AsyncDownload(Context context, String url, File file, ReadableMap urlProps, TaskCompleted listener) {
        this.context = context;
        this.listener = listener;
        this.file = file;
        this.url = url;
        this.urlProps = urlProps;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        exception = null;
    }

    private void copyAndFlush(InputStream input, OutputStream output) throws IOException {
        int count;
        byte data[] = new byte[BUFF_SIZE];

        while ((count = input.read(data)) != -1) {
            output.write(data, 0, count);
        }

        output.flush();
    }

    private Void handleContentUri(Uri uri) {
        try (
                InputStream input = context.getContentResolver().openInputStream(uri);
                OutputStream output = new FileOutputStream(file)
        ) {
            copyAndFlush(input, output);
        } catch (Exception e) {
            exception = e;
        }
        return null;
    }

    @Override
    protected Void doInBackground(Void... params) {
        Uri uri = Uri.parse(this.url);
        if (uri.getScheme().equalsIgnoreCase(CONTENT)) {
            return handleContentUri(uri);
        }

        URL url;
        HttpURLConnection connection;

        try {
            url = new URL(this.url);
            String protocol = url.getProtocol();
            if (!protocol.equalsIgnoreCase(HTTP) && !protocol.equalsIgnoreCase(HTTPS)) {
                exception = new IOException("Protocol \"" + protocol + "\" is not supported");
                return null;
            }
            connection = (HttpURLConnection) url.openConnection();
            enrichWithUrlProps(connection);
            connection.connect();
        } catch (Exception e) {
            exception = e;
            return null;
        }

        try (
                InputStream input = new BufferedInputStream(connection.getInputStream(), BUFF_SIZE);
                OutputStream output = new FileOutputStream(file)
        ) {
            copyAndFlush(input, output);
        } catch (IOException e) {
            exception = e;
        }

        return null;
    }

    @Override
    protected void onPostExecute(Void param) {
        listener.onComplete(exception);
    }

    private void enrichWithUrlProps(HttpURLConnection connection) throws IOException {
        if (urlProps == null) {
            return;
        }
        setRequestMethod(connection);
        setRequestHeaders(connection);
        setRequestBody(connection);
    }

    private void setRequestMethod(HttpURLConnection connection) throws IOException {
        String method = "GET";

        if (urlProps.hasKey(PROP_METHOD)) {
            if (urlProps.getType(PROP_METHOD) != ReadableType.String) {
                throw new IOException("Invalid method type. String is expected");
            }
            method = urlProps.getString(PROP_METHOD);
        }

        connection.setRequestMethod(method);
    }

    private void setRequestHeaders(HttpURLConnection connection) throws IOException {
        if (!urlProps.hasKey(PROP_HEADERS)) {
            return;
        }

        ReadableMap headers = urlProps.getMap(PROP_HEADERS);

        if (headers == null) {
            return;
        }

        ReadableMapKeySetIterator iterator = headers.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();

            if (headers.getType(key) == ReadableType.String) {
                connection.setRequestProperty(key, headers.getString(key));
            } else {
                throw new IOException("Invalid header key type. String is expected for " + key);
            }
        }
    }

    private void setRequestBody(HttpURLConnection connection) throws IOException {
        if (!urlProps.hasKey(PROP_BODY)) {
            return;
        }

        if (urlProps.getType(PROP_BODY) != ReadableType.String) {
            throw new IOException("Invalid body type. String is expected");
        }

        String body = urlProps.getString(PROP_BODY);

        if (body.getBytes().length > 0) {
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Length", "" + body.getBytes().length);
            try (OutputStream writer = connection.getOutputStream()) {
                writer.write(body.getBytes());
                writer.flush();
            }
        }
    }

    public interface TaskCompleted {
        void onComplete(Exception ex);
    }
}
