var map = L.map('map').setView([34.159, -118.38], 11.5);
var basemap =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map)

function bindBoundaryPopups(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}
function bindPointPopups(feature, layer) {
    if (feature.properties && feature.properties["MO Codes"]) {
        timeStr = feature.properties["Time Occurred"].toString()
        popupText = "At "+timeStr.slice(0,timeStr.length-2)+":"+timeStr.slice(timeStr.length-2,timeStr.length)+" on "+feature.properties["Date Occurred"].slice(0,10)+", a "+feature.properties["Victim Age"]+" year old "
        gender = ""
        if(feature.properties["Victim Sex"]=="M"){
            gender = "man "
        }
        else if(feature.properties["Victim Sex"]=="F"){
            gender = "woman "
        }
        else{
            gender = "person "
        }
        popupText += gender + " was hit by a car here"
        bikePedText = ""
        if(feature.properties["MO Codes"].includes("3003")){ //pedestrian
            bikePedText = " while walking."
        }
        else if(feature.properties["MO Codes"].includes("3008")){
            bikePedText = " while biking."
        }
        else{
            bikePedText = "."
        }
        popupText += bikePedText
        ksiText = ""
        if(feature.properties["MO Codes"].includes("3027")){
            ksiText = " They were killed in the crash."
        }
        else if(feature.properties["MO Codes"].includes("3024")){
            ksiText = " They were seriously injured in the crash."
        }
        else{
            ksiText = " Thankfully, they were not seriously hurt in the crash."
        }
        popupText += ksiText
        //layer.bindPopup("<b>Date: "+feature.properties["Date Occurred"]+"<br>Age: "+feature.properties["Victim Age"]+"<br>Fatal Crash: "+feature.properties["Fatal Crash"]);
        layer.bindPopup(popupText)
    }
}



var boundaryURL = "layers/cd4_divisions.geojson"

var boundary = new L.GeoJSON.AJAX("layers/cd4_divisions.geojson", {
    onEachFeature: bindBoundaryPopups,
    style: {
        "color":"#000000", 
        "weight": 2, 
        "fillOpacity": 0
    }
})
boundary.addTo(map)


function redMarker(shape){
    return {
    shape: shape,
    color: "white",
    fillColor: "red",
    radius: 6,
    weight: 1,
    opacity: 1,
    fillOpacity: 1}
}

    

function blackMarker(shape){
    return {
    shape: shape,
    color: "white",
    fillColor: "black",
    radius: 6,
    weight: 1,
    opacity: 1,
    fillOpacity: 1}
}



////MO codes: 3003 = ped, 3008 = bike






xhr = new XMLHttpRequest()

xhr.open("GET", "https://hfrahn.pythonanywhere.com/collision_years", true)

xhr.onload = () => {
    years = JSON.parse(xhr.response)
    console.log(years)

    var fatal = 0
    var pedCrash = 0
    var bikeCrash = 0
    var ksiCrash = 0

    var collisionsArray = []

    for(i = 0; i < years.length; i++){
        collisionsArray.push(L.marker([0,0]))
    }

    for(i = 0; i < years.length; i++){

        filePath = "https://hfrahn.pythonanywhere.com/collisions/"+years[i]
        collisionsArray[i] = new L.GeoJSON.AJAX(filePath, {
            onEachFeature: bindPointPopups,
            pointToLayer: function(feature, latlng){
                // console.log(fatal)
                // console.log(bikeCrash)
                // console.log(pedCrash)
                // console.log(ksiCrash)
                //console.log(feature.properties["Date Reported"])
                //console.log(feature.properties["Victim Age"])
                //fatal crash
                if(feature.properties["MO Codes"].includes("3024")){
                    ksiCrash += 1
                }
                if(feature.properties["MO Codes"].includes("3027")){
                    fatal += 1
                    if (feature.properties["MO Codes"].includes("3003")){ //ped
                        pedCrash += 1
                        var marker = L.shapeMarker(latlng, redMarker("triangle"))
                        // marker.addTo(allcollisions2019)
                        // marker.addTo(fatalcollisions2019)
                        return marker
                    }
                    //not ped so bike
                    bikeCrash+=1
                    var marker = L.circleMarker(latlng, redMarker("circle"))
                    // marker.addTo(allcollisions2019)
                    // marker.addTo(fatalcollisions2019)
                    return marker
                }
                else{
                    if (feature.properties["MO Codes"].includes("3003")){ //ped
                        pedCrash += 1
                        var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                        //marker.addTo(allcollisions2019)
                        return marker
                    }
                    //not ped so bike
                    bikeCrash += 1
                    var marker =  L.circleMarker(latlng, blackMarker("circle"))
                   // marker.addTo(allcollisions2019)
                    return marker
                    
                }
                
            }
            
        })
        //collisionsArray[i].addTo(map)

    }
    var markerClusters = L.markerClusterGroup({ maxClusterRadius: 30}).addTo(map);

    var dummyLayers = []
    for(i = 0; i < years.length; i++){
        dummyLayers.push(L.marker([0,0]))
    }

    console.log(dummyLayers)



    var overlayMaps = {}
    for(i = 0; i < years.length; i++){
        overlayMaps[years[i]] = dummyLayers[i]
    }
    console.log(overlayMaps)

    var layerControl = L.control.layers(null, overlayMaps, {collapsed : false, position: 'topright'})

    layerControl.addTo(map)

    map.on('overlayadd', function(e){
        index = years.indexOf(e.name)
        markerClusters.addLayer(collisionsArray[index])
    });

    map.on('overlayremove', function(e){
        index = years.indexOf(e.name)
        markerClusters.removeLayer(collisionsArray[index])
    });

    var heatmapURL = "layers/heatmap_smallerkernels.tif"

    fetch(heatmapURL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
            const min = georaster.mins[0];
            const max = georaster.maxs[0];
            const range = georaster.ranges[0];

            var scale = chroma.scale(["green", "green", "yellow", "red"]);
            var layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.5,
                resolution: 128,
                pixelValuesToColorFn: function(pixelValues) {
                    var pixelValue = pixelValues[0]; 
                    // if there's zero density, don't return a color
                    if (pixelValue < 0.005) return null;
                    var scaledPixelValue = ((pixelValue - min) / range)+0.3;
                    var color = scale(scaledPixelValue).hex();
                    return color;
                },

            });
            layerControl.addOverlay(layer, "heatmap")
            layer.addTo(map)
        });
    });
        
};

xhr.send(null);




 var legend = L.control({position: 'bottomleft'});

 legend.onAdd = function (map) {
 
     var div = L.DomUtil.create("div", "legend")
     div.innerHTML += "<b>Legend</b>" + "<br>Green = Less Crashes, Red = More Crashes<br>Triangle = Pedestrian Hit by Car <br>Circle = Biker Hit by Car<br> Red Triangle/Circle = Fatal Crash"
     return div
 };
 
 legend.addTo(map);


// add clickable zoom buttons
resedaVanowen = document.getElementById("rv")
resedaVanowen.addEventListener("click", function (event) {
    map.setView([34.193, -118.536], 15)  
})

resedaSaticoy = document.getElementById("rs")
resedaSaticoy.addEventListener("click", function (event) {
    map.setView([34.208, -118.536], 15)  
})

venturaVanNuys = document.getElementById("vv")
venturaVanNuys.addEventListener("click", function (event) {
    map.setView([34.151, -118.448], 15)  
})

highlandFranklin = document.getElementById("hf")
highlandFranklin.addEventListener("click", function (event) {
    map.setView([34.104, -118.338], 16)  
})

burbankVanNuys= document.getElementById("bv")
burbankVanNuys.addEventListener("click", function (event) {
    map.setView([34.172, -118.448], 16)  
})


// add modal info buttons

btns = document.querySelectorAll("button.modalButton")
modals = document.querySelectorAll('.modal')
spans = document.getElementsByClassName("close")

// When the user clicks the button, open the modal
for (i = 0; i < btns.length; i++) {
    btns[i].onclick = function(e) {
       e.preventDefault(); 
       modal = document.querySelector(e.target.getAttribute("href"));
       modal.style.display = "block";
    }
}
for (var i = 0; i < spans.length; i++) {
    spans[i].onclick = function() {
       for (var index in modals) {
         if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
       }
    }
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
     for (var index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";    
     }
    }
}


