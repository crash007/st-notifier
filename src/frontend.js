

jQuery(document).ready(function () {
   
    readCacheFromStorage(function(cache){
        var relativePath = window.location.pathname;
    
            //Visiting an premium article
            if(relativePath.includes("/logga-in")){
                
                console.log("Visiting premium-page");
                var searchKey = relativePath.split("/").pop();
    
                console.log("Searching for "+searchKey+" , in cache");
                
                $(cache).each(function(){
                    
                    if(this.key.includes(searchKey) ){
                        console.log("Cachehit!");
                        $('.locked-wrapper').hide(1000);//, done:  
                        replaceContent(decompress(this.value));//});
                        return false; //break loop
                    }
                });
            }else{
                //main page icon class
                $(cache).each(function(i,e){
                    var link = e.key;
                    
    	        	$('a[href="'+link+'"] .premium-label.m-icon-plus').not('.soft-unlocked').addClass("cached-content");

                });
            }
    });
});

function replaceContent(content){
    console.log("replaceing content");
    $('.row.unpadded.single-article').replaceWith(content).hide('fast').show(2000);
    $('.main-wrapper.main-fullwidth .extended-headline').after('<p style="color: orange;">STanna uppdaterad: Visar innehåll från cache.</p>');
    $('.locked-article-image-wrapper').hide(1000);
    
}
