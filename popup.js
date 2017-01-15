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

    // Re-format the data and put it into a Map object
    // Input Array:  [<bookmarksObj>,<bookmarksObj>...]
    // Output Map: {<tag>:[<bookmarkObj>,<bookmarkObj>...], <tag>:[<bookmarkObj>,<bookmarkObj>...]...}
    var bkmrksMap = new Map();
    for (var i = 0; i < bkmrksArr.length; i++) {
        var bkmrksObj = bkmrksArr[i];
        if (bkmrksMap.has(bkmrksObj.tags[0])) {
            bkmrksMap.get(bkmrksObj.tags[0]).push(bkmrksObj);
        } else {
            var arr = new Array(bkmrksObj);
            bkmrksMap.set(bkmrksObj.tags[0], arr);
        }
    }
    var mapAsc = new Map(bkmrksMap.sort());
    console.log(mapAsc);

    // Pass the output map from above to the function below. Function will create a folder
    // for each key (tag) under the root folder and adds the bookmarks to the tag folders respectively.
    addBkmrksToChrome(bkmrksMap);
}

function addBkmrksToChrome(bkmrksMap) {
    chrome.bookmarks.getTree(
        function(node) {
            bookmarkBarNode = node[0].children[0]; //node location for chrome 'bookmark bar'
            chrome.bookmarks.create({
                    'parentId': bookmarkBarNode.id,
                    'title': 'Imported From Delicious'
                },
                function(importFolder) {
                    // Iterate through the map, create a chrome folder for each tag and add the bookmarks using the chrome bookmark api
                    for (var mapToArr of bkmrksMap) {
                        var tag = mapToArr[0];
                        var bookmarksArr = mapToArr[1];
                        addFolderThenBkmrks(importFolder.id, tag, bookmarksArr);
                    }
                    // Change UI to reflect completed state
                    document.getElementById("loading_img").style.display = "none";
                    document.getElementById("completedMessage").style.display = "block";
                    document.getElementById("completedMessage").innerHTML = '<h1>' + numBkmrks + ' bookmarks imported!</h1>';
                });
        });
}

function addFolderThenBkmrks(importFolderId, tag, bookmarksArr) {
    chrome.bookmarks.create({
            'parentId': importFolderId,
            'title': tag
        },
        function(newTagFolder) {
            bookmarksArr.forEach(function(bookmark) {
                chrome.bookmarks.create({
                    parentId: newTagFolder.id,
                    title: bookmark.title,
                    url: bookmark.url
                });
            });
        });
}

// Add EventListener for the import button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("import_button").addEventListener("click", importBkmrks);
});
