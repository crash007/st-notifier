chrome.storage.local.get({'intervall': 45}, function(result){
    var intervall = result.intervall;

    chrome.alarms.create("checkerAlarm", {
        delayInMinutes: 1,
        periodInMinutes: intervall
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("alarm larm");
    if (alarm.name === "checkerAlarm") {       
        checkForUpdates();
    }
});

chrome.notifications.onClicked.addListener(function (url) {
    chrome.tabs.create({ url: url });
    chrome.notifications.clear(url);
});


function notification(link, text) {
    var url = "https://www.st.nu" + link;

    var opt = {
        type: "basic",
        title: "Ny artikel",
        message: text,
        iconUrl: "https://www.st.nu/favicon.ico",
        requireInteraction: true
    }
    console.log("Making notification for "+url);
    chrome.notifications.create(url, opt);

}

function checkForUpdates() {
    $.get("https://www.st.nu", function (data) {
        parsePage(data)
    });
}

//Collect new articles from main page
function parsePage(data) {

    var links = {};
    //data = $(data);

    //Senaste nytt - top off page
    var el = $(data).find('.slide').find('.soft-unlocked').parent().parent();
    $.each(el, function (i, e) {
        var text = $(e).text().trim();
        var link = $(e).attr("href");
        //console.log(link + " " + text);
        links[link] = text;
    });


    //Rest of page
    el = $(data).find('.teaser-content-wrapper  .content  .soft-unlocked.premium-label.m-icon-plus').closest('.content').find('a').not('.teaser-text');
    
    $.each(el, function (i, e) {
        var text = $(e).find('h2').text().trim();
        var link = $(e).attr("href");
        //console.log(link + " " + text);
        links[link] = text;
    });

        readCacheAndNotifyParametersFromStorage(function(linksCache,notify){
            updateCacheAndNotify(linksCache,notify,links);
        });

}

function updateCacheAndNotify(cache, notify, links) {
    var cacheMap = cacheArrayToMap(cache);
    //console.log("updateCacheAndNotify")
    var updateCache = false; //only update if we have new entries
    //Iterate all links found on page
    
    var linksNotIncache = [];
    $.each(links, function (link, text) {
        //Save and notify new articles
        
        if (!cacheMap.has(link)) {
            if (notify) {
                notification(link, text);
            }
            linksNotIncache.push(link);
            
            updateCache = true;
        }
    });

    if(updateCache){
        var deferreds = $.map(linksNotIncache, function(link) {
            return getArticleContent(link,cacheMap);
        });

        $.when.apply($, deferreds).then(function() {
            console.log('All calls done');
            updateCacheMapAndBadge(cacheMap);
        });
    }

}

function updateCacheMapAndBadge(cacheMap){
    saveCachemapToStorage(cacheMap, setBadgeText);
}

function setBadgeText() {
    readCacheFromStorage(function(cache){
            chrome.browserAction.setBadgeText({ "text": cache.length.toString() });
        } 
     );
}




function getArticleContent(link, cacheMap){

    return jQuery.ajax({
        url: "https://www.st.nu" + link,
        success: function (data) {          
            let result = $(data).find('.single-article')[0];
            
            //Save some space
            $(result).find('.meta-actions.meta-actions-footer').remove();
            $(result).find('.ad-placement').closest('.row').remove();
            
            result = whiteWashContent(result.outerHTML);
            cacheMap.set(link,compress(result));
                            
        },
        async: true
    });
}

function whiteWashContent(str){
    return str.replace(new RegExp('\n\\s+','g'),'\n').replace(/>\n</gi, '><');
}