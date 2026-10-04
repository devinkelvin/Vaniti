package com.vaniti.app;

import android.app.Activity;
import android.os.Bundle;
import android.net.Uri;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
import android.util.Log;

import java.io.InputStream;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

public class MainActivity extends Activity {
    private static final String TAG = "VanitiApp";
    private WebView mWebView;

    // Ordered endpoints: USB ADB Reverse -> Local Wi-Fi Network -> Embedded Offline Standalone
    private static final String[] SERVER_URLS = new String[] {
        "http://localhost:5174",
        "http://192.168.1.197:5174",
        "https://vaniti.local/index.html"
    };
    private int mCurrentUrlIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        WebView.setWebContentsDebuggingEnabled(true);

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(Color.parseColor("#090b0e"));
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setGeolocationEnabled(true);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d(TAG, "Page successfully loaded: " + url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e(TAG, "WebView Error (" + errorCode + "): " + description + " URL: " + failingUrl);
                tryFallbackUrl(view);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
                if (request.isForMainFrame()) {
                    Log.e(TAG, "Main frame error: " + error.getDescription() + " URL: " + request.getUrl());
                    tryFallbackUrl(view);
                }
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("vaniti.local".equals(uri.getHost())) {
                    String path = uri.getPath();
                    if (path == null || path.equals("/") || path.isEmpty()) {
                        path = "/index.html";
                    }
                    if (path.startsWith("/")) {
                        path = path.substring(1);
                    }
                    String assetPath = "dist/" + path;

                    try {
                        InputStream is = getAssets().open(assetPath);
                        String mimeType = "application/octet-stream";
                        if (path.endsWith(".html")) mimeType = "text/html";
                        else if (path.endsWith(".js")) mimeType = "application/javascript";
                        else if (path.endsWith(".css")) mimeType = "text/css";
                        else if (path.endsWith(".png")) mimeType = "image/png";
                        else if (path.endsWith(".svg")) mimeType = "image/svg+xml";
                        else if (path.endsWith(".json")) mimeType = "application/json";

                        Map<String, String> headers = new HashMap<>();
                        headers.put("Access-Control-Allow-Origin", "*");
                        return new WebResourceResponse(mimeType, "UTF-8", 200, "OK", headers, is);
                    } catch (IOException e) {
                        try {
                            InputStream is = getAssets().open("dist/index.html");
                            Map<String, String> headers = new HashMap<>();
                            headers.put("Access-Control-Allow-Origin", "*");
                            return new WebResourceResponse("text/html", "UTF-8", 200, "OK", headers, is);
                        } catch (IOException ex) {
                            return null;
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            private void tryFallbackUrl(final WebView view) {
                mCurrentUrlIndex++;
                if (mCurrentUrlIndex < SERVER_URLS.length) {
                    final String nextUrl = SERVER_URLS[mCurrentUrlIndex];
                    Log.i(TAG, "Auto-connecting to next endpoint (" + mCurrentUrlIndex + "): " + nextUrl);
                    view.post(new Runnable() {
                        @Override
                        public void run() {
                            view.loadUrl(nextUrl);
                        }
                    });
                }
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d(TAG, "JS Console: " + cm.message() + " -- Line " + cm.lineNumber());
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        Log.i(TAG, "Connecting to Vaniti server: " + SERVER_URLS[0]);
        mWebView.loadUrl(SERVER_URLS[0]);
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
