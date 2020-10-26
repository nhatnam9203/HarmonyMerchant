package com.hpmerchant;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import javax.annotation.Nonnull;

import com.pax.poslink.PaymentRequest;
import com.pax.poslink.PaymentResponse;
import com.pax.poslink.PosLink;
import com.pax.poslink.ProcessTransResult;
import com.pax.poslink.CommSetting;

import com.facebook.react.bridge.Callback;

public class PoslinkModule extends  ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    PoslinkModule(ReactApplicationContext context){
        super(context);
        reactContext =  context;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void show(String ip, String port,String timeout,Callback errorCallback,Callback successCallback) {
         CommSetting commSetting = new CommSetting();
        commSetting.setType(CommSetting.TCP);
        commSetting.setDestIP(ip);
        commSetting.setDestPort(port);
        commSetting.setTimeOut(timeout);

        PosLink posLink = new PosLink();
        posLink.SetCommSetting(commSetting);

        PaymentRequest paymentRequest = new PaymentRequest();

        paymentRequest.TenderType = paymentRequest.ParseTenderType("CREDIT");
        paymentRequest.TransType = paymentRequest.ParseTransType("SALE");
        paymentRequest.Amount = "100";
        paymentRequest.CashBackAmt = "";
        paymentRequest.ECRRefNum = "1";
        paymentRequest.ClerkID = "";
        paymentRequest.Zip = "";
        paymentRequest.TipAmt = "";
        paymentRequest.TaxAmt = "";
        paymentRequest.Street = "";
        paymentRequest.Street2 = "";
        paymentRequest.SurchargeAmt = "";
        paymentRequest.PONum = "";
        paymentRequest.OrigECRRefNum = "";
        paymentRequest.OrigRefNum = "";
        paymentRequest.InvNum = "";
        paymentRequest.ECRTransID = "";
        paymentRequest.AuthCode = "";
        paymentRequest.FuelAmt = "";
        paymentRequest.ExtData = "<TipRequest>1</TipRequest>";

        posLink.PaymentRequest = paymentRequest;
        ProcessTransResult processTransResult = posLink.ProcessTrans();

        if (processTransResult.Code == ProcessTransResult.ProcessTransResultCode.OK) {
            successCallback.invoke("Success!");
        }else {
            errorCallback.invoke(processTransResult.Msg);
        }
    }

    @Nonnull
    @Override
    public String getName() {
           return "PoslinkModule";
    }
}
