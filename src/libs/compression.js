function compress(content){
    
    //Firefox compatible
    var replaced = insertVariables(content);
    
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
    
    var replaced = content.replace(/https:\/\/bildix.mmcloud.se\/bildix\/api\/images\//gi, '$1$').replace(/.jpg\?fit=crop&amp;w=/g,'$2$');
    var diff = content.length - replaced.length;
    console.log("Inserting variables. length before was "+content.length+"  and length after "+replaced.length+ " , difference: "+diff);

    return replaced;
}

function replaceVariables(content){
    console.log("replaceing variables");
    return content.replace(/\$1\$/g,'https://bildix.mmcloud.se/bildix/api/images/').replace(/\$2\$/g, '.jpg?fit=crop&amp;w=')
}

