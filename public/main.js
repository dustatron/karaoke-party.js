
var isLoggedIn = function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
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
btnNew.addEventListener('click', function(){

    var userID = firebase.auth().currentUser.uid;

    var endOfYear = {
        name: 'end of year',
        user: userID,
        songs: 'all the hits'
    }

    firestore.collection("parties").add(endOfYear)
    .then(function(docRef) {
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





