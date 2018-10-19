window.onload = function(){

  var data;
  initialisation();

  function initialisation(){
    var iniDate = new Date();
    console.log((iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()).toString());
    document.getElementById("start").value = (iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()-5).toString();
    document.getElementById("end").value = (iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()).toString();
    compareDate();
    document.getElementById("loadingWheel").style.display = "none";
    eventListener();
  }
  
  function eventListener(){
    document.getElementById("start").addEventListener("input", function (e) {
      document.getElementById("mainDisplay").innerHTML = "";
      compareDate();
    });

    document.getElementById("end").addEventListener("input", function (e) {
      document.getElementById("mainDisplay").innerHTML = "";
      compareDate();
    });

    document.addEventListener("click", function(event){

      if(event.explicitOriginalTarget.className != null && event.explicitOriginalTarget.className == "planetImage"){
        console.log(event.explicitOriginalTarget.attributes.src.value);
        var imageGrande = document.createElement("img");
        imageGrande.setAttribute("src", event.explicitOriginalTarget.attributes.src.value);
        imageGrande.setAttribute("id", "imagePopUp");
                document.getElementById("popImage").appendChild(imageGrande);
        document.getElementById("popImage").style.display = "block";
      } 
    });


    document.getElementById("echapBouton").addEventListener("click", function(){
      document.getElementById("popImage").style.display = "none";
      document.getElementById("popImage").removeChild(document.getElementById("imagePopUp"));
    }); 


    document.getElementById("submitButton").addEventListener("click", function(e) {
      document.getElementById("mainDisplay").innerHTML = "";
      var element = document.getElementById("search").value;
      var searchOption
      if (document.getElementById('title').checked) 
      {
        searchOption = 'title';
      }
      if(document.getElementById('description').checked)
      {
        searchOption = 'description';
      }
      searchElement(element, searchOption, 0);
    });

    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape"){
        document.getElementById("popImage").style.display = "none";
      }

    });




    document.getElementById("search").addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        document.getElementById("submitButton").click();
      }
    }); 

  }

  function compareDate(){
    var iniDate = new Date();
    dateMin = document.getElementById("start").value;
    dateMax = document.getElementById("end").value;
    var today = new Date ((iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()).toString());
    if(new Date(dateMin).getTime() <= new Date(dateMax).getTime()){
      // PB IFFFFFFFFFFFFF
      console.log("MAX : " + new Date(dateMax).getTime());
      console.log("TODAY : " + today.getTime());
      if(new Date(dateMax).getTime() <= today.getTime()){
        httpGetNasaInformation()
        
      }
      else{
        console.log("Date over the limits");
        clearMain();
      }
    }
    else{
      console.log("Date invalide");
      clearMain();
    }
  }

  function clearMain(){
    var noValue = document.createElement("h1");
    noValue.setAttribute("class", "noValue");
    document.getElementById("mainDisplay").innerHTML = "";
    document.getElementById("mainDisplay").appendChild(noValue);
    noValue.innerHTML = "No Value :/";
  }

  function updateMainDisplay(resultat){
    document.getElementById("mainDisplay").innerHTML = "";
    var htmlContent="";
    console.log(resultat);
    resultat.forEach(function(element){
      var planetDiv = document.createElement("div");
      planetDiv.setAttribute("class", "planetDiv");
      document.getElementById("mainDisplay").appendChild(planetDiv);
      var planetFlex = document.createElement("div");
      planetFlex.setAttribute("class","planetFlex");
      var planetTitle = document.createElement("h3");
      planetTitle.setAttribute("class", "planetTitle");
      planetDiv.appendChild(planetTitle);
      planetDiv.appendChild(planetFlex);
      var planetImage = document.createElement("img");
      planetImage.setAttribute("src", element.url);
      planetImage.setAttribute("class", "planetImage");
      planetFlex.appendChild(planetImage);
      var planetDescription = document.createElement("p");
      planetDescription.setAttribute("class", "planetDescription");
      planetFlex.appendChild(planetDescription);
      planetDescription.innerHTML = element.explanation;
      planetTitle.innerHTML = element.title;
    });
  }

  function httpGetNasaInformation(token, element, searchOption) {

   var nasaUrl = "https://api.nasa.gov/planetary/apod?start_date="+document.getElementById("start").value+"&end_date="+document.getElementById("end").value+"&api_key=adcf5NXtwfqF8d7briGqahatgUAuyaN6MgK1qIxf";
   document.getElementById("loadingWheel").style.display = "inline"; 
   const req = new XMLHttpRequest();

   req.onreadystatechange = function(event) {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        var resultat = JSON.parse(this.responseText);
        if(resultat.length === 0){
          console.log("VIDE");
          document.getElementById("loadingWheel").style.display = "none";
          clearMain();
        }
        else{
          if(token===1){
            console.log("testtetsegsdg" + resultat);

            processSearch(element, searchOption, resultat)

            
          }
          else{
           console.log("Good");
           document.getElementById("loadingWheel").style.display = "none";
           updateMainDisplay(resultat);
         }
         
       }
     } else {
      console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
      document.getElementById("loadingWheel").style.display = "none";
      clearMain();
    }
  }
};
req.open('GET', nasaUrl, true);
req.send(null);
}

function searchElement(element, searchOption)
{
  httpGetNasaInformation(1,element, searchOption);

}
function processSearch(element, searchOption, data){
 var searchValue = element.toString();
 var searchCategory = searchOption;
 var position
 if(searchCategory === "description")
 {
  var result = data.filter(function(article) {
    console.log(article.explanation.toString().search(searchValue));
    if(article.explanation.toString().search(searchValue) !== -1)
    {
      return article.date;
    }
  });
}
else
{
  var result = data.filter(function(article) {
    if(article.title.toString().search(searchValue) !== -1)
    {
      return article.date;
    }
  });
}
document.getElementById("loadingWheel").style.display = "none";
updateMainDisplay(result);
if(document.getElementById("mainDisplay").innerHTML === ""){
  clearMain();
}
}


};

