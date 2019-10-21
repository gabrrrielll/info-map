function initMap(lat, lng) {
    if (lat === undefined) lat = 44.450622; // if don't receive coordonates arguments will give some values
    if (lng === undefined) lng = 26.114591;

    var mapDiv = document.getElementById("map");
    var map = new google.maps.Map(mapDiv, {
        zoom: 3,
        center: new google.maps.LatLng(lat, lng),
    });

    function getDayLimits(lat, lng, time) {
        //function to get from API the limits of day  in the search area

        var apicall = "https://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + lng + "&formatted=0";

        var xhr = new XMLHttpRequest(); // create new XMLHttpRequest object
        xhr.open("GET", apicall); // open GET request
        xhr.onload = function() {
            if (xhr.status === 200) {
                // if Ajax request successful
                var output = JSON.parse(xhr.responseText); // convert returned JSON string to JSON object

                if (output.status == "OK") {
                    // if API reports everything was returned successfully

                    //console.log('getDayLimits-------->', output.results)
                    var sunriseTime = new Date(output.results.sunrise).getTime() / 1000; //extract sunrise time and convert in UNIX time
                    var sunsetTime = new Date(output.results.sunset).getTime() / 1000; //extras sunset time and convert in UNIX time
                    var localTimeStamp = new Date(response.data.results.sunrise).getTimezoneOffset() * 60 + time;

                    //console.log("sunrise to compare--->", sunriseTime, time, sunsetTime)
                    if (sunriseTime < localTimeStamp && localTimeStamp < sunsetTime) {
                        //compare time to check if the time is in the day limits
                        document.getElementById("infoDay").innerHTML = "Daylight";
                    } else {
                        document.getElementById("infoDay").innerHTML = "Night";
                    }
                }
            } else {
                console.log("Request failed.  Returned status of " + xhr.status);
            }
        };
        xhr.send(); // send request
    }

    function getData(lat, lng) {
        var apicall = "https://api.timezonedb.com/v2.1/get-time-zone?key=6F6YBU30VGBM&format=json&by=position&lat=" + lat + "&lng=" + lng;

        var xhr = new XMLHttpRequest(); // create new XMLHttpRequest object
        xhr.open("GET", apicall); // open GET request
        xhr.onload = function() {
            if (xhr.status === 200) {
                // if Ajax request successful
                var output = JSON.parse(xhr.responseText); // convert returned JSON string to JSON object
                console.log(output.status, output); // log API return status for debugging purposes
                if (output.status == "OK") {
                    // if API reports everything was returned successfully

                    var time = output.timestamp; // extract the local time in UNIX format

                    getDayLimits(lat, lng, time); //call function to get day limit and compare with local time

                    var displayData = "Selected country: " + output.countryName; // extract from API and display the country only if selected
                    document.getElementById("infoCountry").innerHTML = displayData;
                }
            } else {
                console.log("Request failed.  Returned status of " + xhr.status);
            }
        };
        xhr.send(); // send request
    }

    //add a  event here to track latitude and longitude when map is clicked.
    google.maps.event.addListener(map, "click", function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        //  when event click exist will triger these two functions

        initMap(lat, lng); //function for recenter the map

        getData(lat, lng); //function for get data from API
    });
}
