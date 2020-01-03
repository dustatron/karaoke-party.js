var param = window.location.search.substring(1);
var playlistDB = firestore.collection("parties").doc(param);


//----- Nav Buttons -----
var navButtons = function() {
    var search, playlist, share;

    search = $( ".searchNavBtn" ).click(function() {
        $(".slider-box").css( 'transform', 'translateX(0vw)');
      });;

      playlist = $( ".playlistNavBtn" ).click(function() {
        $(".slider-box").css( 'transform', 'translate(-95vw, 0px)');
      });;

      share = $( ".shareNavBtn" ).click(function() {
        console.log('click');
      });;

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
                console.log("Document written with ID: ", docRef.id);
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
    playlistDB.collection("playlist")
        .onSnapshot(function(querySnapshot) {
            document.getElementById('list').innerHTML = " ";

            querySnapshot.forEach(function(doc) {
                var id = doc.id;

                document.getElementById('list').innerHTML += doc.data().songName + '<hr>';

            });
        });
}();
