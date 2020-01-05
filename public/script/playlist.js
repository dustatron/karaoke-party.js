var param = window.location.search.substring(1);
var playlistDB = firestore.collection("parties").doc(param);
// var searchScreen = $('#printout');

//---- Check Log in Status ------
var isLoggedIn = function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var userID = firebase.auth().currentUser.uid;
            LiveUpdate(userID);
        }else{
            window.location.replace('index.html?' + param);
        }
    });
  
}();


//----- Nav Buttons -----
var navButtons = function() {
    var search, playlist, share, boxSlider;

    boxSlider = $(".playlist-box--slider");

    search = $( ".searchNavBtn" ).click(function() {
        console.log('search');
        document.getElementById('slider-box').scrollIntoView();
        boxSlider.css( 'transform', 'translateX(-95vw)');
        
      });

      playlist = $( ".playlistNavBtn" ).click(function() {
        console.log('playlist');
        boxSlider.css( 'transform', 'translate(0vw, 0px)');
      });

      share = $( ".shareNavBtn" ).click(function() {
        console.log('click');
      });

}();

//---- New Song Logic
var newSong = function() {
    var newSongInput = $( "#newSongInput" );
    var newSongBtn = $( "#newSongBtn" );

    newSongBtn.click(function(){

        getVideo(newSongInput.val()+ ' karaoke');
    });

    function getVideo(keyWord) {
        $.ajax({
          type: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/search',
          data: {
              key: 'AIzaSyALUE5ilnA9ploGAm3iE2hi4uNoCHTgt4o',
              q: keyWord,
              part: 'snippet',
              order: 'relevance',
              maxResults: 15,
              type: 'video',
              videoEmbeddable: true,
          },
          success: function(data){
            console.log(data);

            embedVideo(data)
          },
          error: function(response){
              console.log("Request Failed");
          }
        });
      }
    
      function embedVideo(data) {
        var printOut = document.getElementById('printout');
        printOut.innerHTML = " ";

            data.items.forEach(function(video, index){
                printOut.innerHTML += '<div class="card">'+
                '<div class="col-xs-12 text-center"><h4>'+ video.snippet.title + '</h4></div>' +
                '<div class="col-xs-4 embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" src="https://www.youtube.com/embed/'+ video.id.videoId +'"></iframe></div>'+
                '<div class="col-md-12"><p class="description">'+video.snippet.description+'<p></div>'+
                '<div class"col-md-12" ><button id="'+ index +'" type="button" class="add-btn btn btn-secondary btn-lg btn-block">Add Song</button></div>'+
                '</div><br>';

            });

            var addBtn = document.querySelectorAll('.add-btn');
            addBtn.forEach(function(doc){
                doc.addEventListener('click', function(){
                    // window.location.href = 'playlist.html?' + doc.value;
                    addNewSongToFirestore(doc.id);
                });
        
        });

        var addNewSongToFirestore = function(value) {
            var currentTime = new Date().getTime();

            //New Song Object
            var addSong = {
                timeStamp: currentTime,
                songName:  data.items[value].snippet.title,
                description: data.items[value].snippet.description,
                youtubeID: data.items[value].id.videoId,
                thumbnail: data.items[value].snippet.thumbnails.default.url
            }
    
            //Write to Firestore
            playlistDB.collection("playlist").add(addSong)
            .then(function(docRef) {
                newSongInput.val(' ');
                printOut.innerHTML = '<div class="card text-center"> <h3>Your video "'+ data.items[value].snippet.title +'" was added </h3> </div>';
                topFunction();
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    };

    
};
newSong();  

// --- Live Readout
var LiveUpdate = function() {
    playlistDB.collection("playlist").orderBy("timeStamp")
        .onSnapshot(function(querySnapshot) {
            // Clears list 
            var listOut = document.getElementById('listout')
            listOut.innerHTML = " ";
            var tally = 0;

            //Writes list
            querySnapshot.forEach(function(doc, i) {
                // songObj.push(doc.data().youtubeID);
                tally ++;
                listOut.innerHTML += '<div id="'+ tally +'" class="song-box">'+
                // '<div class="song-box--img">' + '<img class="song-box--image" src="'+ doc.data().thumbnail +'" alt="image"></div>' +
                 '<div class=" col-md-12 song-box--copy"><span class="tally">['+tally+']</span>'+doc.data().songName + ' </div>' +
                '</div>';
            });
            
        });
}();

var songCountUpdater = function (){
    playlistDB.onSnapshot(function(doc) {
        showCurrentSong(doc.data().songCount);
    });
}();

function showCurrentSong(que) {
    clearCurrentSong();
    currentSong = document.getElementById(que);
    currentSong.classList.add("active-song");

  }

  function clearCurrentSong() {
    clearList = document.querySelectorAll('.active-song');
    clearList.forEach(function(doc){
      doc.classList.remove("active-song");
    });
  }

function topFunction() {
    console.log('topFunction');

    document.getElementById('slider-box').scrollIntoView(true);
  }