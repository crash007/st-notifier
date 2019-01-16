//import { link } from "fs";

function readCacheFromStorage(callbackFn){
    chrome.storage.local.get({ 'linksCache':[] }, function (result) {
        console.log("Reading saved linksCache:");
        cache = result.linksCache;
        callbackFn(cache);
    });
}

function readCacheAndNotifyParametersFromStorage(callbackFn){
    chrome.storage.local.get({ 'linksCache':[] ,'notify':false}, function (result) {
        console.log("Reading saved linksCache:");
        cache = result.linksCache;
        notify = result.notify;
        callbackFn(cache,notify);
    });
}

function saveCachemapToStorage(cacheMap, callbackFn){
  
    var linksCache = cacheMapToArray(cacheMap);
    set(linksCache);

    function set(linksCache){
        chrome.storage.local.set({ 'linksCache': linksCache }, function () {
            console.log('Saving linksCache: '); 
            var error = chrome.runtime.lastError;  
            if (error) {  
                console.log(error);
                set(linksCache.shift());
            } else{
                callbackFn();
            }
        });
    }
}


function cacheArrayToMap(arr){
    result = new Map();
    
    $(arr).each(function(){
        result.set(this.key, this.value);
    });
    return result;
}

function cacheMapToArray(map){
   
    result = [];
    for (const [key, value] of map.entries()) {
        result.push({key, value});
    };
    return result;
}
