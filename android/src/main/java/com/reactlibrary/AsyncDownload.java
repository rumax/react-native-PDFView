package com.reactlibrary;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.os.AsyncTask;
import android.util.Log;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

class AsyncDownload extends AsyncTask<Void, Void, Void> {
    private static String TAG = "AsyncDownload";
    private static int BUFF_SIZE = 8192;
    private AsyncTaskCompleted listener;
    private File file = null;
    private String resource = null;
    private IOException exception;

    public AsyncDownload(String resource, File file, AsyncTaskCompleted listener) {
        this.listener = listener;
        this.file = file;
        this.resource = resource;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        exception = null;
        Log.i(TAG, "onPreExecute");
    }

    @Override
    protected Void doInBackground(Void... params)  {
        URL url;
        URLConnection connection = null;
        try {
            url = new URL(resource);
            connection = url.openConnection();
            connection.connect();
        } catch (IOException e) {
            exception = e;
            return null;
        }
        try (
                InputStream input = new BufferedInputStream(url.openStream(), BUFF_SIZE);
                OutputStream output = new FileOutputStream(file);
        ) {
            long total = 0;
            int count;
            Log.d(TAG, "Downloading");
            int lengthOfFile = connection.getContentLength();
            Log.d(TAG, "length of the file: " + lengthOfFile);
            byte data[] = new byte[BUFF_SIZE];

            while ((count = input.read(data)) != -1) {
                total += count;
                output.write(data, 0, count);
            }

            output.flush();
            Log.d(TAG, "total: " + total);
        } catch (IOException e) {
            exception = e;
        }

        return null;
    }

    @Override
    protected void onPostExecute(Void param) {
        Log.d(TAG, "onPostExecute");
        if (exception == null) {
            listener.downloadTaskCompleted();
        } else {
            listener.downloadTaskFailed(exception);
        }
    }
}
