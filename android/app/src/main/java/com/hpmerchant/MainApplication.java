package com.hpmerchant;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.polidea.reactnativeble.BlePackage;
import it.innove.BleManagerPackage;
import com.tkporter.sendsms.SendSMSPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import cl.json.RNSharePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.bolan9999.SpringScrollViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
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
import com.microsoft.codepush.react.CodePush;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import java.util.Arrays;
import java.util.List;

import com.hpmerchant.PoslinkModulePackage;

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
            new RNSoundPlayerPackage(),
            new RNDateTimePickerPackage(),
            new BlePackage(),
            new BleManagerPackage(),
            SendSMSPackage.getInstance(),
          new ReactNativePushNotificationPackage(),
            new RNSensitiveInfoPackage(),
            new RNSharePackage(),
            new ReactNativeFirebaseMessagingPackage(),
            new ReactNativeFirebaseAppPackage(),
            new AsyncStoragePackage(),
            new NetInfoPackage(),
            new SpringScrollViewPackage(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage(),
            new RNViewShotPackage(),
            new RNPermissionsPackage(),
            new RNCameraPackage(),
            new ReactNativeYouTube(),
            new RNFetchBlobPackage(),
            new RNStarPrntPackage(),
            new FastImageViewPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
              new RNCViewPagerPackage(),
            new PoslinkModulePackage(),
            new CodePush("WIPNFxhxOnC-CPUztRPNuYj4HMhWmkKi-8UOj", MainApplication.this, BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected String getJSBundleFile() {
    return CodePush.getJSBundleFile();
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
