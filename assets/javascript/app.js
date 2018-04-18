// ================================
// ======= GLOBAL VARIABLES =======
// ================================

// initializing firebase
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

// variables for modes
var isDisplayModeOn;

// variable for Google Maps
var map, infoWindow;
var loc;

// =============================
// ========== ACTIONS ==========
// =============================

// toggle functions
function toggleDisplay() {

    hideAllInfo();

    isDisplayModeOn = true;

    console.log("Display mode activated!");
    $("#edit-mode").removeClass("active");
    $("#display-mode").addClass("active");

}

function toggleEdit() {

    hideAllInfo();

    isDisplayModeOn = false;

    console.log("Edit mode activated!");
    $("#display-mode").removeClass("active");
    $("#edit-mode").addClass("active");

}

function hideAllInfo () {

    console.log("Info hidden!");
    $("#side-panel").removeClass("smenu-open").addClass("smenu-close");
    $("#side-edit").removeClass("smenu-open").addClass("smenu-close");

}

// init Map function that MUST be declared globally, do not move into doc ready
function initMap() {

    // our default location: berkeley
    var defaultLoc = { lat: 37.8712, lng: -122.2727 };

    // declaring map object
    var map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLoc,
        zoom: 13,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                stylers: [{ visibility: "off" }]
            }
        ]
    });



    // adding search bar
    var input = document.getElementById("pac-input");
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", function () {

        var place = autocomplete.getPlace();

        if (!place.geometry) {

            return;

        }

        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);

        } else {

            map.setCenter(place.geometry.location);
            map.setZoom(17);

        }

    });

    $(".close-button").on("click", function () {

        $("#side-panel").removeClass("smenu-open").addClass("smenu-close");
        $("#side-edit").removeClass("smenu-open").addClass("smenu-close");
        console.log("sidebar closed");

    })


    

    // adding click event that generates new markers
    /* $(document).ready(function (){ */
        
    database.ref().on("child_added", function(childSnapshot) { // i tried loading database markers before click function, no luck.
        console.log(childSnapshot);
        // take location from childSnapshot to make a marker on the page
        // console.log(childSnapshot.val().markLat);
        
        var contentString = "<div class='clickme'>" + childSnapshot.val().content+ "</div>"; // comment part of the form

        var infowindow = new google.maps.InfoWindow({ // leave this alone!
            content: contentString
        });

        var marker = new google.maps.Marker({
            position: {lat: childSnapshot.val().markLat, lng: childSnapshot.val().markLng},
            map: map,
            // add more information here?
            content: childSnapshot.val().content,
            date: childSnapshot.val().date,
            location: childSnapshot.val().location
        });

        marker.addListener("click", function () { // this only works on firebase marker, has to stay inside firebase function
            loc = marker.position;
            console.log(loc.lat()+"   "+loc.lng());
            $(".blurb").text(marker.content); // marker is not global
            $(".location").text(marker.location);
            $(".date").text(marker.date);
            if (isDisplayModeOn === true) {   
    
                infowindow.open(map, marker); // change to (map, this)
    
            } else if (isDisplayModeOn === false) {
    
                $("#side-edit").removeClass("smenu-close").addClass("smenu-open");
    
            }
            
        });
    });
    map.addListener("click", function (e) {
        console.log(this);
        // makes so this only runs in edit mode
        loc = e.latLng;
        console.log(loc.lat()+"   "+loc.lng());
        
        if (isDisplayModeOn === true) {
            return;
        }

        //lat and lng is available in e object
        loc = e.latLng;
        console.log(loc.lat()+"   "+loc.lng());

        /*   var newLatitude = {
            lat: loc.lat(),
            lng: loc.lng(),
        } */

        /* database.ref().push(newLatitude); */


        // info window stuff
        // this needs to change based off what is clicked, the "comment" part of the form
        var contentString = "<div class='clickme'>" + "Hi! There!" + "</div>"; // comment part of the form

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        // make new marker
        var marker = new google.maps.Marker({
            position: { lat: loc.lat(), lng: loc.lng() },
            map: map,
            
        });
        
        map.panTo(marker.getPosition());
        console.log("did it move?");
        console.log(marker);
        console.log(loc.lat());
        
        
        marker.addListener("click", function () { // this only works on recently made marker, has to stay inside click function
            loc = marker.position;
            console.log(loc.lat()+"   "+loc.lng());
            $(".blurb").text(marker.content); // marker is not global
            $(".location").text(marker.location);
            $(".date").text(marker.date);
            if (isDisplayModeOn === true) {   
    
                infowindow.open(map, marker); // change to (map, this)
    
            } else if (isDisplayModeOn === false) {
    
                $("#side-edit").removeClass("smenu-close").addClass("smenu-open");
    
            }
            
        });
    
        // whatever panel open, close them
        hideAllInfo();
        

    });
    
        
        
    /* }); */
    
    

};

// =====================================================
// === DOCUMENT READY: ONLY FOR NON GOOGLE MAP STUFF ===
// =====================================================

$(document).ready(function () {

    $(document.body).on("click", ".clickme", function () {

        console.log("Blurb clicked!");

        if ($("#display-mode").hasClass("active")) {

            console.log("Display mode has class active!");

            // open side info when display mode is active
            // edit side-panel to display the information form the marker
            $("#side-panel").removeClass("smenu-close").addClass("smenu-open");


        } else if ($("#edit-mode").hasClass("active")) {

            console.log("Edit mode has class active!");

            // open side edit when edit mode is active
            $("#side-edit").removeClass("smenu-close").addClass("smenu-open");

        }

    });


    // jessica's code
    $("#edit-button").on("click", function (event) {
        event.preventDefault();

        var currentTime = moment(currentTime).format("hh:mm a");
        var content = $("#comment-input").val().trim();
        var location = $("#location-input").val().trim();
        var date = $("#date-input").val().trim();

        console.log("content: ", content);
        console.log("time: ", currentTime);
        console.log("location: ", location);
        console.log("date: ", date);

        var newComment = {
            content: content,
            location: location,
            date: date,
            time: currentTime, // picture?
            markLat: loc.lat(), // cannot be stored as one object, the "loc" object contains functions
            markLng: loc.lng()
        };

        database.ref().push(newComment);

        $("#comment-input").val("");
        $("#location-input").val("");
        $("#date-input").val("");
        $("#side-edit").removeClass("smenu-open").addClass("smenu-close"); // close side edit once you've hit submit!


    });

    // allows display mode to be activated
    $("#display-mode").on("click", toggleDisplay);

    // allows edit mode to be activated
    $("#edit-mode").on("click", toggleEdit);

    // initialize toggle
    toggleDisplay();

    // document ready closing tag
});