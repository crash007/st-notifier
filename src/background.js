chrome.runtime.onInstalled.addListener(function () {

    setBadgeText();
    checkForUpdates();
    
    chrome.alarms.create("10min", {
        delayInMinutes: 10,
        periodInMinutes: 10
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === "10min") {
            console.log("alarm larm")
            checkForUpdates();
        }
    });

    chrome.notifications.onClicked.addListener(function (url) {
        console.log('click notification');
        chrome.tabs.create({ url: url });
        chrome.notifications.clear(url);
    });

    //chrome.browserAction.onClicked.addListener(clearCache);
    
});


function clearCache(){
    console.log("clearing cache");
    //saving empty object
    saveLinksCache({});
}

function notification(link, text) {
    var url = "https://www.st.nu" + link;

    var opt = {
        type: "basic",
        title: "Ny artikel",
        message: text,
        iconUrl: "https://www.st.nu/favicon.ico",
        requireInteraction: true
    }

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

    //Rest of page
    el = $(data).find('.teaser-content-wrapper > .content')
        .find('.soft-unlocked.premium-label.m-icon-plus')
        .parent()
        .parent()
        .parent()
        .parent();
    
    $.each(el, function (i, e) {
        var text = $(e).find('.lead-text').text().trim();
        var link = $(e).find('a').attr("href");
        console.log(link + " " + text);
        links[link] = text;
    });


    //Senaste nytt - top off page
    var el = $(data).find('.slide').find('.soft-unlocked').parent().parent();
    $.each(el, function (i, e) {
        var text = $(e).text().trim();
        var link = $(e).attr("href");
        console.log(link + " " + text);
        links[link] = text;
    });

    chrome.storage.local.get(['linksCache'], function (result) {

        var linksCache = result.linksCache;

        if (typeof linksCache === 'undefined') {
            linksCache = {};
        }

        console.log(linksCache);
        
        var updateCache = false;
        
        //Iterate all links found on page
        $.each(links, function (link, text) {
            
            //Save and notify new articles
            if ( !(link in linksCache) ){
                notification(link, text);
                var content = getArticleContent(link);
                console.log(content)
                linksCache[link]=content;
                updateCache = true;
            }
        });
        
        if(updateCache){
            saveLinksCache(linksCache)
        }

    });
}

function saveLinksCache(linksCache){
    chrome.storage.local.set({ 'linksCache': linksCache }, function () {
        console.log('Saving linksCache: '); 
        console.log(linksCache);
        setBadgeText();
    });
}

function setBadgeText() {
    chrome.storage.local.get(['linksCache'], function (result) {
        console.log("Reading saved linksCache:");
        console.log(result);
        var cacheLength = Object.entries(result.linksCache).length;
        console.log(cacheLength);
        chrome.browserAction.setBadgeText({ "text": cacheLength.toString() });
    });
}

function getArticleContent(link){

    var result;
    jQuery.ajax({
        url: "https://www.st.nu" + link,
        success: function (data) {          
            result = $(data).find('.single-article')[0].outerHTML;
            //result = $($(data).find('.row.unpadded.single-article')[0])().html();                      
        },
        async: false
    });
    console.log(result);
    return result;
}