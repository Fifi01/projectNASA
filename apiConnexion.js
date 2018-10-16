window.onload = function(){
  var bloqueur = true;
  document.getElementById("loadingWheel").style.visibility = "hidden";


  document.getElementById("start").addEventListener("input", function (e) {
    compareDate();
  });
  document.getElementById("end").addEventListener("input", function (e) {
    compareDate();
  });

  function compareDate(){
    dateMin = document.getElementById("start").value;
    dateMax = document.getElementById("end").value;
    if(new Date(dateMin).getTime() <= new Date(dateMax).getTime() ){
      updateMainDisplay();
    }
    else{
      console.log("Date invalide");
    }
  }
  function updateMainDisplay(){
    document.getElementById("mainDisplay").innerHTML = "";
    var resultat = httpGetNasaInformation();
    var htmlContent="";
    console.log(resultat);
    resultat.forEach(function(element){
      var planetDiv = document.createElement("div");
      planetDiv.setAttribute("class", "planetDiv");
      document.getElementById("mainDisplay").appendChild(planetDiv);
      var planetTitle = document.createElement("h3");
      planetTitle.setAttribute("class", "planetTitle");
      planetDiv.appendChild(planetTitle);
      var planetImage = document.createElement("img");
      planetImage.setAttribute("src", element.url);
      planetImage.setAttribute("class", "planetImage");
      planetDiv.appendChild(planetImage);
      var planetDescription = document.createElement("p");
      planetDescription.setAttribute("class", "planetDescription");
      planetDiv.appendChild(planetDescription);
      planetDescription.innerHTML = element.explanation;
      planetTitle.innerHTML = element.title;


    });
  }
  function httpGetNasaInformation(theUrl)
  {
    var nasaUrl = "https://api.nasa.gov/planetary/apod?start_date="+document.getElementById("start").value+"&end_date="+document.getElementById("end").value+"&api_key=adcf5NXtwfqF8d7briGqahatgUAuyaN6MgK1qIxf";
    document.getElementById("loadingWheel").style.visibility = "visible"; 
    var httpRequest = new XMLHttpRequest();
    httpRequest.open( "GET", nasaUrl, false );
    httpRequest.send( null );
    document.getElementById("loadingWheel").style.visibility = "hidden";
    var resultat = JSON.parse(httpRequest.responseText);
    return resultat;
  }




};
