var param = window.location.search.substring(1);
var playlistDB = firestore.collection("parties").doc(param);

//---- New Song Logic
var newSong = function() {
    var newSongInput = document.getElementById('newSongInput');
    var newSongBtn = document.getElementById('newSongBtn');

    
    newSongBtn.addEventListener('click', function(){
        // var user = firebase.auth().currentUser;
        var currentTime = new Date().getTime();

        //New Party Object
        var addSong = {
            songName: newSongInput.value,
            timeStamp: currentTime
        }

        //Write to Firestore
        playlistDB.collection("playlist").add(addSong)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    });
}();

// --- Live Readout
var LiveUpdate = function() {
    playlistDB.collection("playlist")
        .onSnapshot(function(querySnapshot) {
            document.getElementById('list').innerHTML = " ";

            querySnapshot.forEach(function(doc) {
                var id = doc.id;

                document.getElementById('list').innerHTML += doc.data().songName + '<hr>';

                });
            });
        }();
