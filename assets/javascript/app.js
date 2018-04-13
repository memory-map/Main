  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHwZqvulvp_MbrSBxHDe3jjR1VF1PqCwo",
    authDomain: "memory-map-3b3c8.firebaseapp.com",
    databaseURL: "https://memory-map-3b3c8.firebaseio.com",
    projectId: "memory-map-3b3c8",
    storageBucket: "memory-map-3b3c8.appspot.com",
    messagingSenderId: "784730700070"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var content; var currentTime = moment(currentTime).format("hh:mm a");


$("#edit-button").on("click", function(event) {
    content = $("#comment-input").val().trim();
    console.log("content: ", content);
    console.log("time: ", currentTime);
    var newComment = {
        content: content,
        time: currentTime
      };
      database.ref().push(newComment);
});






var map, infoWindow;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 37.8712, lng: -122.2727},
            zoom: 10
        });
        console.log("is the map there?");
/*         var uluru = {lat: -25.363, lng: 131.044};
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        }); */
        
        infoWindow = new google.maps.InfoWindow;

        google.maps.event.addListener(map, "click", function (e) {
            var latLng = e.latLng;
            // make new marker?
            var clickMarker = new google.maps.Marker({
                position: {lat: latLng.lat(), lng:latLng.lng()},
                map: map,
                
            });
            map.panTo(clickMarker.getPosition());
            console.log("did it move?");


            console.log(clickMarker);
            //lat and lng is available in e object
            
            console.log(latLng.lat());
        
        });
        

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log(pos);

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
        
       
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

