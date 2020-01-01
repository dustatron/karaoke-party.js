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
    document.getElementById('test').innerHTML = firebase.auth().currentUser.uid;
    
});

//------- Draw Party List------
var drawParties = function(){
    var userID = firebase.auth().currentUser.uid;
    document.getElementById('test').innerHTML = " ";

    partyDB.where('user', "==", userID)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            document.getElementById('test').innerHTML += "Party Name: " + doc.data().name + '<hr>';
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}





