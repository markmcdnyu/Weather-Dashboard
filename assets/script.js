// Declare variables here
//global empty array
var cityName = [];

//need an emplty string for to store the name of the searched city
var lastCity = "";

//variable for the API key
var API = "c2d54620a6b0445bd3d065fa647633a3";

//Trying to see if I need to set the variable for the API url....might not need it as a global variable
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + API + "&q=";


//Remeber to call the storage function here
storeCity();


//function for the ajax call here
    //within this function will be a lot
function makeAjaxCall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + API + "&q=" + lastCity;

    // This ajax call will actually pull the weather data without the UV data from the API.
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        $("#city").html(
            `${lastCity} ${moment().format(
                "(M/D/YYY)"
            )} <img src =""https://openweathermap.org/img/wn/${
				response.list[0].weather[0].icon
			}@2x.png"/>`
        );
        
        //kelvin to F conversion
        var tempF = (response.list[0].main.temp - 273.15) * 1.8 + 32;

        //now take the temp and push to the dashboard
        $("#temp").html("Temperature: " + tempF.toFixed[0] + " °F"); //degree symbol on Mac is shift opt 8

        //take the humidity and push to dashboard
        $("#humidity").html("Humidity: " + response.list[0].main.humidity + "%");

        //REMEMBER: wind speed into MPH! 
        var milesPerHR = response.list[0].wind.speed * 2.237;

        //take wind speed and push to dashboard
        $("wind").html("Wind Speed: " + milesPerHR.toFixed(1) + " MPH");
        

        //for loop to populate items for the 5 day forecast and also momentjs() for the time 
        for (var i = 1; i < 6; i++) {
            var m = moment().add(i, "d");
            var tempF = (response.list[i].main.temp - 273.15) *1.8 +32;
            
            //title
            $("#cityTitle" + i).html(m.format("m/D/YYYY"));
            //icon
            $("#cityIcon" + i).html(
                `<img src ="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png"/>`
            );
            //temp
            $("#cityTemp" + i).html("Temp: " + tempF.toFixed(0) + " °F");
            //humidity
            $("#cityHumidity" +i).html(
                "Humidity: " + response.list[i].main.humidity + "%"
            );
        }
        
        //It might be that the UV will be different API call because the forecast call is https://api.openweathermap.org/data/2.5/forecast?appid=
        //but the uv call might need to be https://api.openweathermap.org/data/2.5/uvi/history?appid= 
        //Yes, seems to be the case for 2 different calls 
        
        var queryURLuvi = 
            "https://api.openweathermap.org/data/2.5/uvi/history?appid=" + 
            API + 
            "&lat=" +
            response.city.coord.lat +
            "&lon=" +
            response.city.coord.lon +
            "&start=" +
            moment().unix() +
            "&end=" +
            moment().add(1, "d").unix();
        
        // need a function to to make the recent searched city list 
        //within this will most likely need a for loop to create new button for a recent search to go back to and click on
        //will also need to append or prepend the list
        $.ajax({
            url: queryURLuvi,
            method: "GET",
        }).then(function (response) {
            var UVIndex = response
        })



    });
}







//on click event in jquery to search btn

//need function to pull the recently searched into the cycle.  Also need to make Austin the default