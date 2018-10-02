package com.rumax.reactnative.pdfviewer;

/*
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import java.io.IOException;

public interface AsyncTaskCompleted {
    void downloadTaskCompleted();
    void downloadTaskFailed(IOException e);
}
