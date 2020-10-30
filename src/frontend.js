

jQuery(document).ready(function () {
    
    readCacheFromStorage(function (cache) {
        var relativePath = window.location.pathname;

        //Visiting an premium article
        if (relativePath.includes("/logga-in")) {

            console.log("Visiting premium-page");

            var searchKey = relativePath.split("/").pop();

            console.log("Searching for " + searchKey + " , in cache");

            $(cache).each(function () {

                if (this.key.includes(searchKey)) {
                    console.log("Cachehit!");
                    $('.locked-wrapper').hide(1000);
                    if (this.value.includes("<div")) {
                        replaceContent(this.value);
                    } else {
                        replaceContent(decompress(this.value));;
                    }

                    return false; //break loop
                }
            });
        }
        
        //icon class
        $(cache).each(function (i, e) {
            var link = e.key;
            $('a[href="' + link + '"] .premium-label.m-icon-plus').not('.soft-unlocked').addClass("cached-content");
            $('.right-now a[href="' + link + '"]').closest('h2').find('.premium-label.m-icon-plus').not('.soft-unlocked').addClass("cached-content");
        });
       
    });
});

function replaceContent(content) {
    console.log("replaceing content");
    
    $('.main-wrapper').replaceWith(content).hide('fast').show(2000);
    $('h1.headline').after('<p style="color: orange;">STanna uppdaterad: Visar innehåll från cache.</p>');
    $('.locked-article-image-wrapper').hide(1000);

}
