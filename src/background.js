chrome.runtime.onInstalled.addListener(function () {

    checkForUpdates();

    chrome.alarms.create("5min", {
        delayInMinutes: 1,
        periodInMinutes: 1
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name === "5min") {
            console.log("alram alarm larm")
            checkForUpdates();
        }
    });

    chrome.notifications.onClicked.addListener(function (url) {
        chrome.tabs.create({ url: url });
        chrome.notifications.clear(url);
    });

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

    chrome.notifications.create(url, opt);

}

function checkForUpdates() {
    $.get("https://www.st.nu", function (data) {
        parsePage(data)
    });
}

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

    chrome.storage.sync.get(['notifiedLinks'], function (result) {

        var notifiedLinks = result.notifiedLinks;

        if (typeof notifiedLinks === 'undefined') {
            notifiedLinks = [];
        }
        console.log(notifiedLinks);
        //Iterate all links found on page
        $.each(links, function (link, text) {
            //If we havn't notified the link do it.
            if (notifiedLinks.indexOf(link) < 0) {
                notification(link, text);
                chrome.tabs.create({ url: "https://www.st.nu" + link, active: false });
                notifiedLinks.push(link);
            }
        });

        chrome.storage.sync.set({ 'notifiedLinks': notifiedLinks }, function () {
            console.log('notifiedLinks is set to ' + notifiedLinks);
        });


    });


}