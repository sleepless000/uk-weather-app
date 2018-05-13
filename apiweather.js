$(function() {
  var result = $('#result');
  var city = $('#cities');
  var country = $('#countries');

  country.on('change', function() {
    var countryName = country.val();
    if (countryName) {
      city.show()
          .focus()
          .load(countryName + '-cities.html');
      result.html('');
    } else {
      city.hide();
      result.html('');
    }//end conditional
  });//end load cities file

  city.on('change', function(){
    var cityName = city.val();
    if(cityName === 'Select a City') {
      result.html('');
    } else {
      result.html('');
      $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        type: 'GET',
        dataType: 'json',
        timeout: 3000, //timeout 3 sec
        data: {
          "id": cityName,
          "appid": "dfeaf0a927bc9a6894175dd10c9837f2"
        },
        success: function (res) {
          var name = res.name;
          var date = convertTimestamp(res.dt); // convert to just date
          var icon = res.weather[0].icon;
              icon = 'http://openweathermap.org/img/w/' + icon + '.png';
              icon = '<p><img src="' + icon + '" alt="weather icon" width="100" height="100"></p>';
          var description = res.weather[0].description;
              description = capitalizeFirstLetter(description);
          var temp = Math.round(res.main.temp - 273.15); // temp to Celsius
          var windDirect = convertDegree(res.wind.deg); // degree to text description
          var windSpeed = Math.round((res.wind.speed) * 2.2369 * 100) / 100; //miles-per-hour
          //create DOM node
          var msg = $('<p></p>');
          msg.append(icon);
          msg.append(description + '<br>');
          msg.append('The temperature in ' + name + ' on ' + date + ' is ' + temp + '&deg;C<br>');
          msg.append('The wind speed is ' + windSpeed + ' mph and the direction is ' + windDirect);

          result.html(msg);
        }, // end success
        error: function (req, errType, errMessage) {
          result.html('<p>' + errType + ' : ' + errMessage + '</p>');
        }, //end error
        complete: city.blur()
      });//end ajax
    }//end if
  });//end city change

  //helper functions start here
  //get date from timestamp
  function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), //convert timestamp to milliseconds
      year = d.getFullYear(),
      month = ('0' + (d.getMonth() + 1)).slice(-2), //months are zero based. Add leading 0
      day = ('0' + d.getDate()).slice(-2);  //add leading 0
    return day + '-' + month + '-' + year;
  }//end convertTimestamp

  //wind degree to direction calculation:
  //http://climate.umn.edu/snow_fence/components/winddirectionanddegreeswithouttable3.htm
  var convertDegree = function(deg){
    if (deg>11.25 && deg<33.75){
      return "North - North Easterly";
    }else if (deg>33.75 && deg<56.25){
      return "North Easterly";
    }else if (deg>56.25 && deg<78.75){
      return "East - North Easterly";
    }else if (deg>78.75 && deg<101.25){
      return "Easterly";
    }else if (deg>101.25 && deg<123.75){
      return "East South Easterly";
    }else if (deg>123.75 && deg<146.25){
      return "South Easterly";
    }else if (deg>146.25 && deg<168.75){
      return "South - South Easterly";
    }else if (deg>168.75 && deg<191.25){
      return "Southerly";
    }else if (deg>191.25 && deg<213.75){
      return "South - South Westerly";
    }else if (deg>213.75 && deg<236.25){
      return "South Westerly";
    }else if (deg>236.25 && deg<258.75){
      return "West - South Westerly";
    }else if (deg>258.75 && deg<281.25){
      return "Westerly";
    }else if (deg>281.25 && deg<303.75){
      return "West - North Westerly";
    }else if (deg>303.75 && deg<326.25){
      return "North Westerly";
    }else if (deg>326.25 && deg<348.75){
      return "North - North Westerly";
    }else{
      return "Northerly";
    }
  };//end convertDegree

  //first letter upper case
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }//end first letter upper case
});//end document ready
