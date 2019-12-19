package com.hpmerchant;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.RNFetchBlob.RNFetchBlobPackage;
import net.infoxication.reactstarprnt.RNStarPrntPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPermissionsPackage(),
            new RNCameraPackage(),
            new ReactNativeYouTube(),
            new RNFetchBlobPackage(),
            new RNStarPrntPackage(),
            new FastImageViewPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
