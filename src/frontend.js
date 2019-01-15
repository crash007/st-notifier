

jQuery(document).ready(function () {
   
    readCacheFromStorage(function(cache){
        var relativePath = window.location.pathname;
    
            //Visiting an premium article
            if(relativePath.includes("/logga-in")){
                
                console.log("Visiting premium-page");
                var searchKey = relativePath.split("/").pop();
    
                console.log("Searching for "+searchKey+" , in cache");
                
                //var e = cache.find(function(e){return e.key.contains(searchKey)});
                $(cache).each(function(){
                    
                    if(this.key.includes(searchKey) ){
                        console.log("Cachehit!");
                        $('.locked-wrapper').hide('slow');
                        $('.locked-article-image-wrapper').hide('slow');
                        $('.row.unpadded.single-article').replaceWith(decompress(this.value));
                        $('.main-wrapper.main-fullwidth .extended-headline').after('<p style="color: orange;">Visar innehåll från cache.</p>');
                        return false; //break loop
                    }
                });
            }else{
                //main page relace icons
                $(cache).each(function(i,e){
                    var link = e.key;
                    console.log(link);
                    //Senaste nyheter - top of page
                    $('a[href="'+link+'"] h3 .premium-label.m-icon-plus').addClass("cached-content");
                    
                    //Right now
                    $('.right-now a[href="'+link+'"]').siblings('span.premium-label').addClass('cached-content');
                    //Rest of page
                    $('.content a[href="'+link+'"] ').parent().find('.premium-label.m-icon-plus').addClass('cached-content');
                });
            }
    });
});

