function readCacheFromStorage(callbackFn){
    chrome.storage.local.get({ 'linksCache':{} }, function (result) {
        console.log("Reading saved linksCache:");
        console.log(result);
        cache = result.linksCache;
        callbackFn(cache);
    });
}

function readCacheAndNotifyParametersFromStorage(callbackFn){
    chrome.storage.local.get({ 'linksCache':{} ,'notify':false}, function (result) {
        console.log("Reading saved linksCache:");
        console.log(result);
        console.log(arguments);
        cache = result.linksCache;
        notify = result.notify;
        callbackFn(cache,notify);
    });
}

function saveCacheToStorage(linksCache, callbackFn){
    chrome.storage.local.set({ 'linksCache': linksCache }, function () {
        console.log('Saving linksCache: '); 
        console.log(linksCache);
        callbackFn();
    });
}


function cacheArrayToMap(arr){
    result = new Map();
    
    arr.forEach(function(e){
        result.set(e.key,e.value);
    });
    return result;
}