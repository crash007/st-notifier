jQuery(document).ready(function () {
    chrome.storage.local.get(['linksCache'], function (result) {
           
        var linksCache = result.linksCache;
        console.log(linksCache);
       
        var relativePath = window.location.pathname;

        
        //Visiting an premium article
        if(relativePath.includes("/logga-in")){
            
            console.log("Visiting premium-page");
            var searchKey = relativePath.split("/").pop();

            console.log("Searching for "+searchKey+" , in cache");
            
            for (const [key, value] of Object.entries(linksCache)) {
                console.log(key);
                
                if(key.includes(searchKey)){
                    console.log("Cachehit!");
                    $('.locked-wrapper').hide('slow');
                    $('.locked-article-image-wrapper').hide('slow');
                    $('.row.unpadded.single-article').replaceWith(value);
                    return false; //break loop
                }
            }
        }

        if(relativePath == "/"){
            //main page relace icons
            Object.keys(linksCache).forEach(function(link){
                console.log(link);
                //Senaste nyheter - top of page
                $('a[href="'+link+'"] h3 .premium-label.m-icon-plus').addClass("cached-content");
                
                //Rest of page
                $('.content a[href="'+link+'"] ').parent().find('.premium-label.m-icon-plus').addClass('cached-content');
            });
        }
    });
});