// ================================
// ======= GLOBAL VARIABLES =======
// ================================

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

// variable for toggle
var bubbleClose = true;
var map, infoWindow;

// function that fixes init error
function initMap() { };

// =============================
// ========== ACTIONS ==========
// =============================

$(document).ready(function () {

    // =======================================================
    // ===== GOOGLE MAPS ACTIONS GO WITHIN THIS FUNCTION =====

    initMap = function () {

        var defaultLoc = { lat: 37.8712, lng: -122.2727 };

        // declaring map object
        map = new google.maps.Map(document.getElementById('map'), {
            center: defaultLoc,
            zoom: 15,
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

        var marker = new google.maps.Marker({
            position: defaultLoc,
            map: map,
            title: 'Hello World!'
        });

        marker.addListener("click", togglePanel);

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

    }

    function togglePanel() {

        console.log("Hi!");

        if (bubbleClose === true) {

            $(".blurb-bubble").removeClass("b-close").addClass("b-open");

            bubbleClose = false;

        } else if (bubbleClose === false) {

            $(".blurb-bubble").removeClass("b-open").addClass("b-close");

            bubbleClose = true;

            $("#side-panel").removeClass("menu-open");
            $("#side-panel").addClass("menu-close");

        }

    }

    // this shit fucks up easily so instead write it so that
    // one click on pinpoint displays blurb, second click on pinpoint removes blurb and shows side-panel. capisce
    $(".blurb-bubble").on("click", function () {

        console.log("Blurb clicked!");
        $("#side-panel").removeClass("menu-close");
        $("#side-panel").addClass("menu-open");

    });


    // jessica's code
    $("#edit-button").on("click", function (event) {
        content = $("#comment-input").val().trim();
        console.log("content: ", content);
        console.log("time: ", currentTime);
        var newComment = {
            content: content,
            time: currentTime
        };
        database.ref().push(newComment);
    });

    // =======================================
    // ===== OUR UI CLICK EVENTS GO HERE =====

    // allows pinpoint to be clicked
    // $("#pinpoint-placeholder").on("click", function () {

    //     console.log("Pinpoint clicked!", "Bubble status: ", bubbleClose);

    //     if (bubbleClose === true) {

    //         $(".blurb-bubble").removeClass("b-close").addClass("b-open");

    //         bubbleClose = false;

    //         $(".blurb-bubble").on("click", function () {

    //             console.log("Blurb clicked!");
    //             $("#side-panel").removeClass("menu-close");
    //             $("#side-panel").addClass("menu-open");

    //         });

    //     } else if (bubbleClose === false) {

    //         $(".blurb-bubble").removeClass("b-open").addClass("b-close");

    //         bubbleClose = true;

    //         $("#side-panel").removeClass("menu-open");
    //         $("#side-panel").addClass("menu-close");

    //     }

    // });

    // allows display mode to be activated
    $("#display-mode").on("click", function () {

        console.log("Display mode activated!");
        $("#edit-mode").removeClass("active");
        $(this).addClass("active");

        if ($("#display-mode").hasClass("active")) {

            console.log("Display mode has class active!");

        }

    });

    // allows edit mode to be activated
    $("#edit-mode").on("click", function () {

        console.log("Edit mode activated!");
        $("#display-mode").removeClass("active");
        $(this).addClass("active");

        if ($("#edit-mode").hasClass("active")) {

            console.log("Edit mode has class active!");

        }

    });

    // document ready closing tag
});