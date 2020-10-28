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
import com.google.gson.Gson;
import com.facebook.react.bridge.Promise;

public class PoslinkModule extends  ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;
    private static  PosLink instance;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    PoslinkModule(ReactApplicationContext context){
        super(context);
        reactContext =  context;
    }

    public static PosLink getInstance(){
        if(instance == null){
            instance = new PosLink();
        }
        return instance;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void sendTransaction(String ip, String port,String timeout,String tenderType,String amount,String transType ,Callback errorCallback,Callback successCallback) {
        CommSetting commSetting = new CommSetting();
        commSetting.setType(CommSetting.TCP);
        commSetting.setDestIP(ip);
        commSetting.setDestPort(port);
        commSetting.setTimeOut(timeout);

        PosLink posLink = getInstance();
        posLink.SetCommSetting(commSetting);

        PaymentRequest paymentRequest = new PaymentRequest();

        paymentRequest.TenderType = paymentRequest.ParseTenderType(tenderType);
        paymentRequest.TransType = paymentRequest.ParseTransType(transType);
        paymentRequest.Amount = amount;
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
        Gson gson = new Gson();
        if (processTransResult.Code == ProcessTransResult.ProcessTransResultCode.OK) {
            PaymentResponse paymentResponse = posLink.PaymentResponse;
            String data = gson.toJson(paymentResponse);
            successCallback.invoke(data);
        }else {
            String error =  gson.toJson(processTransResult);
            errorCallback.invoke(error);
        }

    }

    @ReactMethod
    public void cancelTransaction(Callback cb) {
//        PosLink posLink = getInstance();
//        posLink.CancelTrans();
        cb.invoke("---- ahihi -----");
    }

    @ReactMethod
    public void voidTransaction(String ip, String port,String timeout,String tenderType,String amount,String transType,String transactionId,String extData ,Callback errorCallback,Callback successCallback) {
        CommSetting commSetting = new CommSetting();
        commSetting.setType(CommSetting.TCP);
        commSetting.setDestIP(ip);
        commSetting.setDestPort(port);
        commSetting.setTimeOut(timeout);

        PosLink posLink = getInstance();
        posLink.SetCommSetting(commSetting);

        PaymentRequest paymentRequest = new PaymentRequest();

        paymentRequest.TenderType = paymentRequest.ParseTenderType(tenderType);
        paymentRequest.TransType = paymentRequest.ParseTransType(transType);
        paymentRequest.Amount = amount;
        paymentRequest.CashBackAmt = "";
        paymentRequest.ECRRefNum = transactionId;
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
        paymentRequest.ExtData = extData;

        posLink.PaymentRequest = paymentRequest;
        ProcessTransResult processTransResult = posLink.ProcessTrans();
        Gson gson = new Gson();
        if (processTransResult.Code == ProcessTransResult.ProcessTransResultCode.OK) {
            PaymentResponse paymentResponse = posLink.PaymentResponse;
            String data = gson.toJson(paymentResponse);
            successCallback.invoke(data);
        }else {
            String error =  gson.toJson(processTransResult);
            errorCallback.invoke(error);
        }

    }

    @Nonnull
    @Override
    public String getName() {
           return "PoslinkModule";
    }
}
