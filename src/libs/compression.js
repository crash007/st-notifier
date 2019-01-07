function compress(content){
    
    //Firefox compatible
    var replaced = insertVariables(content);
    //console.log(replaced);
    var compressedContent = LZString.compressToUTF16(content);
    var compressedReplaced = LZString.compressToUTF16(replaced);

    diff = compressedContent.length-compressedReplaced.length;
    console.log("Compressionsize of unreplaced: "+compressedContent.length+" and compressionsize of replaced "+compressedReplaced.length+" , difference: " +diff);
    return compressedReplaced;
}

function decompress(compressed){
    var decompressed= LZString.decompressFromUTF16(compressed);
    return replaceVariables(decompressed);
}

function insertVariables(content){
   
    var originalLength = content.length;
    
    $.each(getReplacementStrings(), function(index, value){
        content = content.split(value).join('$'+index+'$');   
    });
    var diff = originalLength- content.length;
    console.log("Inserting variables. length before was "+originalLength+"  and length after "+content.length+ " , difference: "+diff);
    
    return content;
}


function replaceVariables(content){
    console.log("replaceing variables");
    var strings = getReplacementStrings();
    $.each(strings, function(index, value){
        content = content.split('$'+index+'$').join(value);
    });
    return content;
}


function getReplacementStrings(){

    return ['https://bildix.mmcloud.se/bildix/api/images/', 
        '.jpg?fit=crop&amp;w=',
        '><figure class="inline-image-wrapper inline-resource"><div class="inline-inner-image-wrapper"><span class="m-icon-enlarge-image"><',
        '1200 1200w" itemprop="image" class="lazy unobserved inline-image" alt="',
        '" onerror="this.style.display=\'none !important\'"></div><div class="byline-caption"><div class="byline-caption-inner"><figcaption class="caption">',
        '></div></div><div class="clearfix"></div></figure><p class="body">',
        '</figcaption><div class="byline" itemprop="copyrightHolder">nBild: ',
        '</p></section></div><div class="column large-two-thirds medium-full article-content"><section class="body" itemprop="articleBody"',
        'div class="column large-full medium-full"><section class="leadin" itemprop="description"><p>',
        '</a></section></div><div class="column large-third medium-third article-aside"></div></div>"',
        '</p></section><section class="byline"><div class="name" itemprop="author">',
        '<div class="row unpadded single-article"><',
        '</p><p class="body">'
    ];
}