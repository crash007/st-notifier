function save_options() {
    var intervall = Number(document.getElementById('intervall').value);
    var notify = document.getElementById('notify').checked;
    console.log(intervall);
    console.log(notify);

    chrome.storage.local.set({
        'intervall': intervall,
        'notify': notify
    }, function () {

        chrome.alarms.clear("checkerAlarm", function(wasCleared){
            console.log(wasCleared);
            chrome.alarms.create("checkerAlarm", {
                delayInMinutes: 1,
                periodInMinutes: intervall
            });
        });



        var status = document.getElementById('status');
        status.textContent = 'Sparat';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        'intervall': true,
        'notify': 15
    }, function (items) {
        document.getElementById('intervall').value = items.intervall;
        document.getElementById('notify').checked = items.notify;
    });

    chrome.storage.local.getBytesInUse(function (bytes) {
        console.log(bytes)
        document.getElementById('mem').textContent = bytes;
    });
}

function exportData() {
    console.log("exporting data");
    chrome.storage.local.get({ 'linksCache': {} }, function (result) {
        console.log(result.linksCache);
        var linksCache = JSON.stringify(result.linksCache);
        console.log(linksCache);

        // Save as file
        var url = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(linksCache)));
        chrome.downloads.download({
            url: url,
            filename: 'export.json'
        });
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('export').addEventListener('click', exportData);