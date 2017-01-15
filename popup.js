// Global variable to store total number of bookmarks to be imported
var numBkmrks;

// Main function that gets called when the import button is clicked
function importBkmrks() {
    // Change UI to reflect processing state
    document.getElementById("loading_img").style.display = "block";
    document.getElementById("importTxtArea").style.display = "none";
    document.getElementById("import_button").style.display = "none";
    document.getElementById("instructionDiv").style.display = "none";

    // Bring data from the front end
    var data = $('#importTxtArea').val();
    var bkmrksArr = JSON.parse(data);
    numBkmrks = bkmrksArr.length;

    // Uses chrome bookmarks API to create the root folder 'Imported from Delicious' and create a folder
    // for each tag under the root folder and adds the bookmarks to the tag folders respectively
    chrome.bookmarks.create({
            'parentId': '1', // Id for Bookmark Bar Node
            'title': 'Imported from Delicious'
        },
        function(importFolder) {
            outerFunc(importFolder.id, bkmrksArr);
        });
}

function outerFunc(importFolderId, bkmrksArr) {
    if (bkmrksArr.length > 0) {
        var currObj = bkmrksArr.pop();
        chrome.bookmarks.search(currObj.tags[0], function callback(searchResultNodesArr) {
            innerFunc(importFolderId, searchResultNodesArr, currObj, bkmrksArr);
        });
    }
    else{
      // Change UI to reflect completed state
      document.getElementById("loading_img").style.display = "none";
      document.getElementById("completedMessage").style.display = "block";
      document.getElementById("completedMessage").innerHTML = '<h1>' + numBkmrks + ' bookmarks imported!</h1>';
    }
}

function innerFunc(importFolderId, searchResultNodesArr, currObj, bkmrksArr) {
    if (searchResultNodesArr.length > 0) {
        var searchObj = searchResultNodesArr.pop();
        if (searchObj.title == currObj.tags[0] && searchObj.parentId == importFolderId) {
            chrome.bookmarks.create({
                'parentId': searchObj.id,
                'title': currObj.title,
                'url': currObj.url
            });
            outerFunc(importFolderId, bkmrksArr);
        } else {
            innerFunc(importFolderId, searchResultNodesArr, currObj, bkmrksArr);
        }

    } else {
        chrome.bookmarks.create({
                'parentId': importFolderId,
                'title': currObj.tags[0]
            },
            function(newFolder) {
                chrome.bookmarks.create({
                    'parentId': newFolder.id,
                    'title': currObj.title,
                    'url': currObj.url
                });
                outerFunc(importFolderId, bkmrksArr);
            });
    }
}

// Add EventListener for the import button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("import_button").addEventListener("click", importBkmrks);
});
