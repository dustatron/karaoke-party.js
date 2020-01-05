var param = window.location.search.substring(1);
var playlistDB = firestore.collection("parties").doc(param);

var songObj = [];
var started = false;
var isPlayingNow = false;

var songCount = 0;
var counter = function(number) {
  if(number === 1) {
    songCount ++;
    playlistDB.update({
      "songCount": songCount });

  } else if(number === 2) {
    songCount = songCount - 2;
    playlistDB.update({
      "songCount": songCount });
  } else {
    return songCount;
  }
}


//UI 
var listOut = document.getElementById('listout');
var partyTitle = document.getElementById('party-title');

//Writing the title
playlistDB.get().then(doc => {
    partyTitle.innerHTML = doc.data().partyName;
});

// --- Live Readout
var LiveUpdate = function() {
    playlistDB.collection("playlist").orderBy("timeStamp")
        .onSnapshot(function(querySnapshot) {
            // Clears list 
            document.getElementById('listout').innerHTML = " ";
            var tally = 0;

            //Writes list
            querySnapshot.forEach(function(doc, i) {
                songObj.push(doc.data().youtubeID);
                tally ++;
                listOut.innerHTML += '<div id="'+ tally +'" class="song-box">'+
                // '<div class="song-box--img">' + '<img class="song-box--image" src="'+ doc.data().thumbnail +'" alt="image"></div>' +
                 '<div class=" col-md-12 song-box--copy"><span class="tally">['+tally+']</span>'+doc.data().songName + ' </div>' +
                '</div>';
            });
            
        });
        
}();

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    var id = songObj[1];
    console.log(id);
    player = new YT.Player('player', {
        'height': '390',
        'width': '640',
        'videoId': 'IvJQTWGP5Fg',
        'events': {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
}



// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == 0) {
        playUpdate();
    //   setTimeout(stopVideo, 6000);
      done = true;
    }
  }
  function stopVideo() {
    player.stopVideo();
  }

  function playVideo() {
      if(started) {
        if(isPlayingNow){
            player.pauseVideo();
            isPlayingNow = false;

        }else{
            player.playVideo();
            isPlayingNow = true;
        }
      }else{
        started = true;
        playUpdate(); 
      }
      
  }

function playerBackword() {
  counter(2);
  //  counter = counter -2;
   playUpdate();
}

  function playUpdate() {
    var end = 'qyQx7nxXdD0';
    var playThis;
    
    if(songObj.length > counter() ) {
      var currentSongNumber = counter();
        playThis = songObj[counter()];
        player.loadVideoById(playThis);
        showCurrentSong(currentSongNumber+1);
        counter(1);
    } else {
        playThis = end;
        player.loadVideoById(playThis);
        stopVideo();
        clearCurrentSong();
    }
  };


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
