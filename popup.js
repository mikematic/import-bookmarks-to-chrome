// Main function that gets called when the import button is clicked
function importBookmarks() {
    // Bring data from the front end
    var data = $('#exportedDeliciousBookmarks').val();
    var bookmarksObj = JSON.parse(data);

    // Re-format the data and put it into a Map object {<tag>:[<bookmarkObj>]...}
    var map = new Map();
    for (var key in bookmarksObj) {
        var tag = bookmarksObj[key]["tags"][0].toLowerCase(); //just use the first tag since chrome bookmarks cant do multiple tags
        var bookmarksArr = map.get(tag);
        if (map.has(tag)) {
            // Do not add bookmark if already in array. Prevent duplicate bookmarks.
            if(!isObjInArray(bookmarksObj[key], bookmarksArr)){
              bookmarksArr.push(bookmarksObj[key]);
              map.set(tag, bookmarksArr);
            }
        } else {
            bookmarksArr = new Array(bookmarksObj[key]);
            map.set(tag, bookmarksArr);
        }
    }
    // Pass the reformatted data to the function and add them to the chrome bookmarks bar
    addBookmarks(map);
}

// Function that uses chrome bookmarks API to create the root folder 'Imported from Delicious' and create a folder
// for each tag under the root folder and adds the bookmarks to the tag folders respectively
function addBookmarks(map){
  chrome.bookmarks.getTree(
      function(node) {
          bookmarkBarNode = node[0].children[0]; //node location for chrome 'bookmark bar'
          chrome.bookmarks.create({
                  'parentId': bookmarkBarNode.id,
                  'title': 'Imported From Delicious'
              },
              function(importFolder) {
                  // Iterate through the map, create a chrome folder for each tag and add the bookmarks using the chrome bookmark api
                  for (var mapToArr of map) {
                      var tag = mapToArr[0];
                      var bookmarksArr = mapToArr[1];
                      addTagsAndBookmarks(importFolder.id, tag, bookmarksArr);
                  }
              });
      });
}

// Function that uses chrome bookmarks api to add the folder
// for tag and add all bookmarks for that tag to folder
function addTagsAndBookmarks(importFolderId, tag, bookmarksArr) {
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

// Function that checks if bookmark is already in the list of bookmarks array
function isObjInArray(bookmarksObj, bookmarksArr){
  for(let obj of bookmarksArr){
    if(obj.title == bookmarksObj.title && obj.url == bookmarksObj.url){
      return true;
    }
  }
  return false;
}

// Function used only for debugging purposes
// Print to console the first couple of Bookmark nodes
function traverseNodesPlain(){
  var node = chrome.bookmarks.getTree(
    function(node){
        var parent = node[0].children[0];
        var firstChild = parent.children[0]
        var firstGrandChild = firstChild.children[0];
        console.log('parent.title: ' + parent.title);
        console.log('firstChild.title: ' + firstChild.title);
        console.log('firstGrandChild.title: ' + firstGrandChild.title);
        for(i=0; i < node[0].children.length; i++){
          console.log('node[0].children[i]: ' + node[0].children[i].title);
        }
    }
  );
}

// Function used only for debugging purposes
// Print to console the all the contents of the chrome bookmark nodes
function traverseNodesRecursively(){
  chrome.bookmarks.getTree(
    //call back function per the specification of the .getTree method
    function(node){
      //declare and implement the helper function that traverses through nodes recursively
      function recursiveImpl(node){
        if(node.children){
          if(node.title){
            console.log('Folder is: ' + node.title + ' and size is: ' + node.children.length);
          }
          var i; //Take out this variable declaration and the script works but it becomes erratic and doesnt complete the traversal.
          for(i=0; i < node.children.length; i++){
            recursiveImpl(node.children[i]);
          }
        }
        else{
          if(node.title){
              console.log('Bookmarks is: ' + node.title);
          }
        }
      }
      //end function

      //call function and pass the base parent node of the chrome browser. This function can also be declared outside the call back function...
      recursiveImpl(node[0]); //node[0] is the base for common chrome browser settings. It includes the children node 'Bookmarks Bar' and 'Other Bookmarks'
    }
    //end call back function
  );
}

// Add EventListener for the import button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("import_button").addEventListener("click", importBookmarks);
    //createDeliciousFolder();
    //traverseNodesRecursively();
});
