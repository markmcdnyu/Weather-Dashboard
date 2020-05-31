// Declare variables here
//global empty array for storage purposes 
var cityName = [];

//need an emplty string for to store the name of the searched city
var lastCity = "Austin";

//variable for the API key
var APIkey = "c2d54620a6b0445bd3d065fa647633a3";

//Trying to see if I need to set the variable for the API url....might not need it as a global variable
// var queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + API + "&q=";


//Remeber to call the storage function here
// storeCity();


//function for the ajax call here
    //within this function will be a lot
function makeAjaxCall() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?&q=" + lastCity + "&appid=" + APIkey;

    // This ajax call will actually pull the weather data without the UV data from the API.
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        $("#city").html(
            `${lastCity} ${moment().format(
                "(M/D/YYYY)"
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
        console.log(response);
    });
     // console log for    
    
    //for loop to populate items for the 5 day forecast and also momentjs() for the time
}
makeAjaxCall();

