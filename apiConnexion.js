window.onload = function(){

  var data;
  initialisation();

  function initialisation(){
    var iniDate = new Date();
    document.getElementById("start").value = (iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()-5).toString();
    document.getElementById("end").value = (iniDate.getFullYear()).toString()+"-"+(iniDate.getMonth()+1).toString()+"-"+ (iniDate.getDate()).toString();
    compareDate();
    document.getElementById("loadingWheel").style.display = "none";
    eventListener();
  }
  
  function eventListener(){

    //changement date debut
    document.getElementById("start").addEventListener("input", function (e) {
      document.getElementById("mainDisplay").innerHTML = "";
      compareDate();
    });

    //changement date fin
    document.getElementById("end").addEventListener("input", function (e) {
      document.getElementById("mainDisplay").innerHTML = "";
      compareDate();
    });

    //Click sur une image
    document.addEventListener("click", function(event){
      if(event.explicitOriginalTarget.className != null && event.explicitOriginalTarget.className == "planetImage"){
        var imageGrande = document.createElement("img");
        imageGrande.setAttribute("src", event.explicitOriginalTarget.attributes.src.value);
        imageGrande.setAttribute("id", "imagePopUp");
        document.getElementById("popImage").innerHTML = "";
        var echap = document.createElement("button");
        echap.setAttribute("id", "echapBouton");

        document.getElementById("popImage").appendChild(echap);
        document.getElementById("echapBouton").addEventListener("click", function(){
          document.getElementById("popImage").style.display = "none";
          document.getElementById("popImage").removeChild(document.getElementById("imagePopUp"));
        }); 
        document.getElementById("popImage").appendChild(imageGrande);
        document.getElementById("popImage").style.display = "block";
      } 
    });


    //clique sur le boutton valider
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

    //appuie sur echap
    document.addEventListener('keydown', (event) => {
      if(event.key === "Escape"){
        document.getElementById("popImage").style.display = "none";
      }

    });

    //appuie sur entrer
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
    resultat.forEach(function(element){


      var planetDiv = document.createElement("div");
      planetDiv.setAttribute("class", "planetDiv");
      document.getElementById("mainDisplay").appendChild(planetDiv);

      var planetDate = document.createElement("p");
      planetDate.setAttribute("class", "planetDate");
      var planetAuthor = document.createElement("p");
      planetAuthor.setAttribute("class", "planetAuthor");

      planetDiv.appendChild(planetDate);
      planetDiv.appendChild(planetAuthor);

      planetDate.innerHTML = "Date : " +  element.date;
      planetAuthor.innerHTML = "Auteur : " + element.copyright;

      var planetFlex = document.createElement("div");
      planetFlex.setAttribute("class","planetFlex");
      var planetTitle = document.createElement("h3");
      planetTitle.setAttribute("class", "planetTitle");
      planetDiv.appendChild(planetTitle);
      planetDiv.appendChild(planetFlex);

      if(element.media_type == "image")
      {
        var planetImage = document.createElement("img");
        planetImage.setAttribute("src", element.url);
        planetImage.setAttribute("class", "planetImage");
        planetFlex.appendChild(planetImage);
      }
      if(element.media_type == "video")
      {
        var planetVideo = document.createElement("IFRAME");
        planetVideo.setAttribute("src", element.url);
        planetVideo.setAttribute("class", "planetVideo");
        planetFlex.appendChild(planetVideo);
      }
      var planetDescription = document.createElement("p");
      planetDescription.setAttribute("class", "planetDescription");
      planetFlex.appendChild(planetDescription);
      planetDescription.innerHTML = element.explanation;
      planetTitle.innerHTML = element.title;

      var planetLink = document.createElement("a");
      planetLink.setAttribute("class", "planetLink");
      planetLink.setAttribute("href", element.url);
      planetDiv.appendChild(planetLink);
      planetLink.innerHTML = "Lire plus";
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
          document.getElementById("loadingWheel").style.display = "none";
          clearMain();
        }
        else{
          if(token===1){
            processSearch(element, searchOption, resultat);
          }
          else{
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