var param = window.location.search.substring(1);
var playlistDB = firestore.collection("parties").doc(param);
var counter = 0;
var songObj = [];



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
            // var tally = 0;

            //Writes list
            querySnapshot.forEach(function(doc, i) {
                songObj.push(doc.data().youtubeID);
                // tally ++;
                listOut.innerHTML += '<div value="'+ doc.data().youtubeID +'" class="card">'+ doc.data().songName + '</div>';
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


//'qx-I0RdNmN0'


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
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

  function playUpdate() {
    var end = 'qyQx7nxXdD0';
    var playThis;
    
    if(songObj.length > counter ) {
        playThis = songObj[counter];
        player.loadVideoById(playThis);
        counter ++;
    } else {
        playThis = end;
        player.loadVideoById(playThis);
        stopVideo();
    }
  };