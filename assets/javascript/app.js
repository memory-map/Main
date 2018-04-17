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
    google.maps.event.addListener(map, "click", function (e) {

        // makes so this only runs in edit mode
        if (isDisplayModeOn === true) {

            return;

        }

        //lat and lng is available in e object
        var latLng = e.latLng;

        // make new marker
        var clickMarker = new google.maps.Marker({
            position: { lat: latLng.lat(), lng: latLng.lng() },
            map: map,

        });

        var newLatitude = {
            lat: latLng.lat(),
            lng: latLng.lng(),
        }

        database.ref().push(newLatitude);

        map.panTo(clickMarker.getPosition());
        console.log("did it move?");

        console.log(clickMarker);
        console.log(latLng.lat());

        // info window stuff
        var contentString = "<div class='clickme'>" + "Hi! There!" + "</div>";

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        clickMarker.addListener("click", function () {

            if (isDisplayModeOn === true) {   

                infowindow.open(map, clickMarker);

            } else if (isDisplayModeOn === false) {

                $("#side-edit").removeClass("smenu-close").addClass("smenu-open");

            }

        });

        // whatever panel open, close them
        hideAllInfo();

    });

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
            $("#side-panel").removeClass("smenu-close").addClass("smenu-open");

        } else if ($("#edit-mode").hasClass("active")) {

            console.log("Edit mode has class active!");

            // open side edit when edit mode is active
            $("#side-edit").removeClass("smenu-close").addClass("smenu-open");

        }

    });

    // jessica's code
    $("#edit-button").on("click", function (event) {

        var currentTime = moment(currentTime).format("hh:mm a");
        var content = $("#comment-input").val().trim();
        var blurb = $("#blurb-input").val().trim();
        var location = $("#location-input").val().trim();
        var date = $("#date-input").val().trim();

        console.log("content: ", content);
        console.log("time: ", currentTime);
        console.log("blurb: ", blurb);
        console.log("location: ", location);
        console.log("date: ", date);

        var newComment = {
            content: content,
            blurb: blurb,
            location: location,
            date: date,
            time: currentTime
        };

        database.ref().push(newComment);

    });

    // allows display mode to be activated
    $("#display-mode").on("click", toggleDisplay);

    // allows edit mode to be activated
    $("#edit-mode").on("click", toggleEdit);

    // initialize toggle
    toggleDisplay();

    // document ready closing tag
});