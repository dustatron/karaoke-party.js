var partyDB = firestore.collection("parties");
var userID;

//---- Check Log in Status ------
var isLoggedIn = function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            userID = firebase.auth().currentUser.uid;
            LiveUpdate();
        }else{
            window.location.replace('index.html');
        }
    });
  
}();
// isLoggedIn();

function logOut (){
    firebase.auth().signOut();
}


// ------- New Party Button ------
var btnNew = document.getElementById('new');
var inputNew = document.getElementById('newInput');
btnNew.addEventListener('click', function(){

    var userID = firebase.auth().currentUser.uid;

    var newParty = {
        name: newInput.value,
        user: userID
    }

    firestore.collection("parties").add(newParty)
    .then(function(docRef) {
        // drawParties();
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});


//---- App Logic ----

var killParty = function(partyID){
    partyDB.doc(partyID).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};


var LiveUpdate = function() {
    partyDB.where('user', "==", userID)
        .onSnapshot(function(querySnapshot) {
            document.getElementById('list').innerHTML = " ";
            // var parties = {};
            querySnapshot.forEach(function(doc) {
                var id = doc.id;

                // Draws Party box
                document.getElementById('list').innerHTML += "<div id='"
                + id +"-01' class='card' > Party: "
                + doc.data().name +
                '<button class="btn btn-primary">Add Songs</button><button id='
                + id +' class="delete-btn btn btn-danger" >Delete</button></div>';

                var delBtn = document.querySelectorAll('.delete-btn');
                delBtn.forEach(function(doc){
                    doc.addEventListener('click', function(){
                        killParty(doc.id);
                        // drawParties();
                    })
                });
            });
        });
}