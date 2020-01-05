var searchInput = $( "#newSongInput" );
var searchBtn = $( "#newSongBtn" ).click(function() {
    getVideo(searchInput.val() + ' Karaoke');
  });;

function getVideo(keyWord) {
    $.ajax({
      type: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      data: {
          key: 'AIzaSyALUE5ilnA9ploGAm3iE2hi4uNoCHTgt4o',
          q: keyWord,
          part: 'snippet',
          order: 'videoCount',
          maxResults: 15,
          type: 'video',
          videoEmbeddable: true,
      },
      success: function(data){
          embedVideo(data)
          console.log(data);
      },
      error: function(response){
          console.log("Request Failed");
      }
    });
  }

  function embedVideo(data) {
    // $('iframe').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)
    // $('h3').text(data.items[0].snippet.title)
    // $('.description').text(data.items[0].snippet.description)

    var printOut = document.getElementById('printout');
    // printOut.innerHTML += data.items[2].snippet.title;
        printOut.innerHTML = " ";
    data.items.forEach(function(video){
        printOut.innerHTML += video.snippet.title + '<br>' +
        '<iframe src="https://www.youtube.com/embed/'+ video.id.videoId +'"></iframe>'+
        '<h3>'+ video.snippet.title+'</h3>'+
        '<p class="description">'+video.snippet.description+'<p>';

    })
}

// getVideo();