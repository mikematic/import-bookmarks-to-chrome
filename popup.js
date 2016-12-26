function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function createDeliciousFolder(bookMarkBarId){
  var node = chrome.bookmarks.getTree(
    function(node){
      bookmarkBarNode = node[0].children[0]; //node location for chrome 'bookmark bar'. children[2] is 'Other bookmarks'
      chrome.bookmarks.create({'parentId': bookmarkBarNode.id,
                               'title': 'Imported From Delicious'},
                               function(newFolder) {
                                 // This is the call back function where you will start adding folders into the newly created folder
                                 // Implementing this here guarantees that the function has successfully created the folder
                                 // This is what you have to deal with asynchronous calls
                                 traverseNodesRecursively();
                               });
    });
}

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

function traverseNodesRecursively(){
  var node = chrome.bookmarks.getTree(
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

document.addEventListener('DOMContentLoaded', function() {
    createDeliciousFolder();
    //traverseNodesRecursively();
});
