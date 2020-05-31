//Declare the variables here

//Declare the empty array variable to store cities being searched.
var cityName = [];

//Declare empty string variable to store the last city searched
var lastCity = "";

// Declare my APIkey from OpenWeather's API
var APIkey = "c2d54620a6b0445bd3d065fa647633a3";

// Put the function here that will locally store the previously searched cities
storeCity();

// Large Ajax function to both call the necessary weather info, but also insert that weather info into the id's of the HTML
//NOTE TO SELF -- this funciton will contain a lot
function makeAjaxCall() {
	//Declare the queryURL that we will use to make the API call
	var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + APIkey + "&q=" + lastCity;

    //NOTE TO SELF--looks like the UV index call is a separate API call. Leaving out for now. This is the base UV api https://api.openweathermap.org/data/2.5/uvi/history?appid=
    //This Ajax call will get the necessary info from the object, then
        //DATE (USE momentJS)
        //LOCATION
        //TEMPERATURE
        //HUMIDITY
        //WIND
        //WEATHER ICON
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(function (response) {
		// Pulls the current city, date, and weather icon from API source link and publishes to weather dashboard.
		$("#city").html(
			`${lastCity} ${moment().format(
				"M/D/YYYY"
			)} <img src ="https://openweathermap.org/img/wn/${
				response.list[0].weather[0].icon
			}@2x.png"/>`
		);
		//NEED TO CONVERT!! -- kelvin to F
        var tempF = (response.list[0].main.temp - 273.15) * 1.8 + 32;
        
		//Pull the temp and push to the #temp ID in HTML
		$("#temp").html("Temperature: " + tempF.toFixed(0) + " °F");

		//Pull the  humidity and push to #humidity ID in HTML
		$("#humidity").html("Humidity: " + response.list[0].main.humidity + "%");

		//NEED TO CONVERT!! -- wind speed to MPH
        var milesPerHR = response.list[0].wind.speed * 2.237;
        
		//Pull the wind speed and push to #wind ID in HTML
		$("#wind").html("Wind Speed: " + milesPerHR.toFixed(1) + " MPH");

        // NEED A FOR LOOP to populate the 5-day forecast
        //
		for (var i = 1; i < 6; i++) {
			var m = moment().add(i, "d");
			var tempF = (response.list[i].main.temp - 273.15) * 1.8 + 32;

			$("#cityTitle" + i).html(m.format("M/D/YYYY"));
			$("#cityIcon" + i).html(
				`<img src ="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png"/>`
			);
			$("#cityTemp" + i).html("Temp: " + tempF.toFixed(0) + " °F");
			$("#cityHumidity" + i).html(
				"Humidity: " + response.list[i].main.humidity + "%"
			);
		}

        /*NEED TO CALL THE SEPARATE UV INDEX API*/
        //momentJS and latitude and longitude
		var queryURLuvi = "https://api.openweathermap.org/data/2.5/uvi/history?appid=" + APIkey +
			"&lat=" +
			response.city.coord.lat +
			"&lon=" +
			response.city.coord.lon +
			"&start=" +
			moment().unix() +
			"&end=" +
			moment().add(1, "d").unix();

		/* THEN< use an Ajax call to then take the lat/lon from teh UV API call and get that info to the weather dashboard*/
		$.ajax({
			url: queryURLuvi,
			method: "GET",
		}).then(function (response) {
			var UVIndex = response[0].value;
            $("#uvIndex").html(UVIndex);
            
            //NEED TO CLEAR THE UV at some point so it can re-run and repopulate 
			$("#uvIndex").removeClass();

			// Adding the conditional if/else for the levels of the UV index(5 catagories). USE CSS for the styling of the categories
			if (UVIndex >= 0 && UVIndex < 3) {
				$("#uvIndex").addClass("low p-1");
			} else if (UVIndex >= 3 && UVIndex < 6) {
				$("#uvIndex").addClass("moderate p-1");
			} else if (UVIndex >= 6 && UVIndex < 8) {
				$("#uvIndex").addClass("high p-1");
			} else if (UVIndex >= 8 && UVIndex < 11) {
				$("#uvIndex").addClass("very_high p-1");
			} else {
				$("#uvIndex").addClass("extreme p-1");
			}
		});
	});
}

//NEED a function and a for loop to both create the locally stored city search list, and also append each city below the search bar in a list
// Making each previously search city into a button and injecting that button into the HTML so users can revisit a locally stored city
function createCityList() {
	$("#cityList").empty();
	for (var i = 0; i < cityName.length; i++) {
		var cityLiItem = $("<button>").text(cityName[i]);
		cityLiItem.addClass(
			"btn btn-outline-secondary d-flex justify-content-start"
		);
        
        /* Calling the makeAjax function call here so that the cityList of previously stored cities,
        re-runs and collects the newest info from the API */
		cityLiItem.on("click", function () {
			lastCity = $(this).text();
			makeAjaxCall();
		});
		$("#cityList").append(cityLiItem);
	}
}

/*
NEED TO push the city into the cityName array after the search button is clicked. 
THEN, store that city into local storage
THEN I will call the functions createCity & makeAjax*/
$("#searchBtn").click(function () {
	var cityTextValue = $("#cityInput").val();
	cityName.push(cityTextValue);
	lastCity = cityTextValue;
	localStorage.setItem("lastCity", lastCity);
	createCityList();
	makeAjaxCall();
});

/* NEED function to take the lastCity value from local storage and then populate the necessary weather info. 
THEN, use Austin as a default, if there is no city selected*/
function storeCity() {
	var storedLastCity = localStorage.getItem("lastCity");
	if (storedLastCity !== null && storedLastCity !== "") {
		lastCity = storedLastCity;
		cityName.push(storedLastCity);
	} else {
		lastCity = "Austin";
		cityName.push(lastCity);
	}
	createCityList();
	makeAjaxCall();
}
