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

    // Sort the array by its first tag
    bkmrksArr = bkmrksArr.sort(function(a, b) {
        if (a.tags[0].toUpperCase() > b.tags[0].toUpperCase()) {
            return 1;
        } else if (a.tags[0].toUpperCase() < b.tags[0].toUpperCase()) {
            return -1;
        } else {
            return 0;
        }
    });

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

    // Pass the sorted map to the function below.
    addBkmrksToChrome(bkmrksMap);
}

// Function takes map object and creates folder for each tag and adds the associated bookmarks
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

// Function that takes a tag and array of associated bookmarks and adds them to the import folder
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
