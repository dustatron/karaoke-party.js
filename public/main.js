var partyDB = firestore.collection("parties");

var isLoggedIn = function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            drawParties();
        }else{
            window.location.replace('index.html');
        }
    });
  
};
isLoggedIn();

function logOut (){
    firebase.auth().signOut();
}


// ------- NEW BUTTON LISTEN ------
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
        drawParties();
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});


// ------- SHOW BUTTON LISTEN ------
var btnShow = document.getElementById('show');
    btnShow.addEventListener('click', function(){
    document.getElementById('list').innerHTML = firebase.auth().currentUser.uid;
    
});

//------- Draw Party List------
var drawParties = function(){
    var userID = firebase.auth().currentUser.uid;
    document.getElementById('list').innerHTML = " ";

    partyDB.where('user', "==", userID)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var id = doc.id;
            // doc.data() is never undefined for query doc snapshots
            document.getElementById('list').innerHTML += "<div id='"
            + id +"-01' class='card' > Party: "
            + doc.data().name +
            '<button class="btn btn-primary">Add Songs</button><button id='
            + id +' class="delete-btn btn btn-danger" >Delete</button></div>';
            
            var delBtn = document.querySelectorAll('.delete-btn');
            delBtn.forEach(function(doc){
                doc.addEventListener('click', function(){
                    killParty(doc.id);
                    drawParties();
                })
            });

            console.log(id, " => ", doc.data());
        });
    })
    .catch(function(error) {
         
        console.log("Error getting documents: ", error);
    });
};


var buildClick = function(){
    var allCards = document.querySelector('.btn-danger');
    allCards.forEach(function(thisCard){
        thisCard.addEventListener('click', function(){
            console.log('click');
        });
    });
};

var killParty = function(partyID){
    partyDB.doc(partyID).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
};



