var partyDB = firestore.collection("parties");


//---- Check Log in Status ------
var isLoggedIn = function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var userID = firebase.auth().currentUser.uid;
            LiveUpdate(userID);
        }else{
            window.location.replace('index.html');
        }
    });
  
}();


// ------- New Party Button ------
var newParty = function() {
    var btnNew = document.getElementById('new');

    var inputNew = document.getElementById('newInput');
    btnNew.addEventListener('click', function(){
        var user = firebase.auth().currentUser;
        var currentTime = new Date().getTime();

        //New Party Object
        var newParty = {
            partyName: newInput.value,
            timestamp: currentTime,
            user: user.uid,
            userName: user.displayName,
            userEmail: user.email,
            userImage: user.photoURL
        }

        //Write to Firestore
        firestore.collection("parties").add(newParty)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    });
}();


//---- App Logic ----

var logOut = function() {
    firebase.auth().signOut();
}

var killParty = function(partyID) {
    partyDB.doc(partyID).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};


var LiveUpdate = function(userID) {
    partyDB.where('user', "==", userID)
        .onSnapshot(function(querySnapshot) {
            document.getElementById('list').innerHTML = " ";
            // var parties = {};
            querySnapshot.forEach(function(doc) {
                var id = doc.id;

                // Draws Party box
                document.getElementById('list').innerHTML += "<div id='"
                + id +"-01' class='card'><h4 class='text-center'> Party: "
                 + doc.data().partyName + '</h4>' +
                '<button value="'+ id +'" class="edit-btn btn btn-primary">Add Songs</button>'+
                '<button value="'+ id +'" class="show-btn btn btn-secondary">Start Show</button></div>'+
                '<button value="'+ id +'" class="delete-btn btn btn-danger btn-block btn-lg">Delete</button></div>'+
                '<hr>';

                var delBtn = document.querySelectorAll('.delete-btn');
                delBtn.forEach(function(doc){
                    doc.addEventListener('click', function(){
                        killParty(doc.value);
                    })
                });

                var showBtn = document.querySelectorAll('.show-btn');
                showBtn.forEach(function(doc){
                    doc.addEventListener('click', function(){
                        window.location.href = 'show.html?' + doc.value;
                    })
                });

                var editBtn = document.querySelectorAll('.edit-btn');
                editBtn.forEach(function(doc){
                    doc.addEventListener('click', function(){
                        window.location.href = 'playlist.html?' + doc.value;
                    })
                });
            });
        });
}