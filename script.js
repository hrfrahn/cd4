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
    if (feature.properties) {
        timeStr = feature.properties["Time Occurred"].toString()
        popupText = "At "+timeStr.slice(0,timeStr.length-2)+":"+timeStr.slice(timeStr.length-2,timeStr.length)+" on "+feature.properties["Date Occurred"]+", a "+feature.properties["Victim Age"]+" year old "
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
        if(feature.properties["Fatal Crash"]=="True"){
            ksiText = " They were killed in the crash."
        }
        else if(feature.properties["Killed\/Seriusly Injured"]=="True"){
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



var fatal = 0
var pedCrash = 0
var bikeCrash = 0
var ksiCrash = 0

//MO codes: 3003 = ped, 3008 = bike


var allcollisions2019 = new L.LayerGroup()
var fatalcollisions2019 = new L.LayerGroup()

var collisions2019 = new L.GeoJSON.AJAX("layers/2019collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Fatal Crash"] == "True"){
            
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker = L.shapeMarker(latlng, redMarker("triangle"))
                marker.addTo(allcollisions2019)
                marker.addTo(fatalcollisions2019)
                return marker
            }
            //not ped so bike
            var marker = L.circleMarker(latlng, redMarker("circle"))
            marker.addTo(allcollisions2019)
            marker.addTo(fatalcollisions2019)
            return marker

        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                marker.addTo(allcollisions2019)
                return marker
            }
            //not ped so bike
            var marker =  L.circleMarker(latlng, blackMarker("circle"))
            marker.addTo(allcollisions2019)
            return marker
            
        }

    }
})

var allcollisions2020 = new L.LayerGroup()
var fatalcollisions2020 = new L.LayerGroup()

var collisions2020 = new L.GeoJSON.AJAX("layers/2020collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Fatal Crash"] == "True"){
            
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker = L.shapeMarker(latlng, redMarker("triangle"))
                marker.addTo(allcollisions2020)
                marker.addTo(fatalcollisions2020)
                return marker
            }
            //not ped so bike
            var marker = L.circleMarker(latlng, redMarker("circle"))
            marker.addTo(allcollisions2020)
            marker.addTo(fatalcollisions2020)
            return marker
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                marker.addTo(allcollisions2020)
                return marker
            }
            //not ped so bike
            var marker =  L.circleMarker(latlng, blackMarker("circle"))
            marker.addTo(allcollisions2020)
            return marker
            
        }
    }
})


var allcollisions2021 = new L.LayerGroup()
var fatalcollisions2021 = new L.LayerGroup()

var collisions2021 = new L.GeoJSON.AJAX("layers/2021collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Fatal Crash"] == "True"){
            
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker = L.shapeMarker(latlng, redMarker("triangle"))
                marker.addTo(allcollisions2021)
                marker.addTo(fatalcollisions2021)
                return marker
            }
            //not ped so bike
            var marker = L.circleMarker(latlng, redMarker("circle"))
            marker.addTo(allcollisions2021)
            marker.addTo(fatalcollisions2021)
            return marker
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                marker.addTo(allcollisions2021)
                return marker
            }
            //not ped so bike
            var marker =  L.circleMarker(latlng, blackMarker("circle"))
            marker.addTo(allcollisions2021)
            return marker
            
        }
    }
})

var allcollisions2022 = new L.LayerGroup()
var fatalcollisions2022 = new L.LayerGroup()

var markerClusters = L.markerClusterGroup({ maxClusterRadius: 30}).addTo(map);

var collisions2022 = new L.GeoJSON.AJAX("layers/2022collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Fatal Crash"] == "True"){
            
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker = L.shapeMarker(latlng, redMarker("triangle"))
                marker.addTo(allcollisions2022)
                marker.addTo(fatalcollisions2022)
                return marker
            }
            //not ped so bike
            var marker = L.circleMarker(latlng, redMarker("circle"))
            marker.addTo(allcollisions2022)
            marker.addTo(fatalcollisions2022)
            return marker
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                marker.addTo(allcollisions2022)
                return marker
            }
            //not ped so bike
            var marker =  L.circleMarker(latlng, blackMarker("circle"))
            marker.addTo(allcollisions2022)
            return marker
            
        }
    }
})


var allcollisions2023 = new L.LayerGroup()
var fatalcollisions2023 = new L.LayerGroup()

var collisions2023 = new L.GeoJSON.AJAX("layers/2023collisions.geojson", {
    onEachFeature: bindPointPopups,
    pointToLayer: function(feature, latlng){
        if(feature.properties["Fatal Crash"] == "True"){
            
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker = L.shapeMarker(latlng, redMarker("triangle"))
                marker.addTo(allcollisions2023)
                marker.addTo(fatalcollisions2023)
                return marker
            }
            //not ped so bike
            var marker = L.circleMarker(latlng, redMarker("circle"))
            marker.addTo(allcollisions2023)
            marker.addTo(fatalcollisions2023)
            return marker
        }
        else{
            if (feature.properties["MO Codes"].includes("3003")){ //ped
                var marker =  L.shapeMarker(latlng, blackMarker("triangle"))
                marker.addTo(allcollisions2023)
                return marker
            }
            //not ped so bike
            var marker =  L.circleMarker(latlng, blackMarker("circle"))
            marker.addTo(allcollisions2023)
            return marker
            
        }
    }
})


var dummy2019 = L.marker([0,0])
var dummy2020 = L.marker([0,0])
var dummy2021 = L.marker([0,0])
var dummy2022 = L.marker([0,0])
var dummy2023 = L.marker([0,0])


console.log(fatalcollisions2019)


var overlayMaps = {
    2019: dummy2019, 
    2020: dummy2020,
    2021: dummy2021, 
    2022: dummy2022,
    2023: dummy2023
}

console.log(overlayMaps)

var none = L.marker([0,0])
var allCollisions = new L.LayerGroup([allcollisions2019, allcollisions2020, allcollisions2021, allcollisions2022, allcollisions2023])
var fatalCollisions = new L.LayerGroup([fatalcollisions2019, fatalcollisions2020, fatalcollisions2021, fatalcollisions2022, fatalcollisions2023])

var baseMaps = {
    "All Crashes": allCollisions, 
    "All Fatal Crashes": fatalCollisions,
    "None": none
}

//add control/legend

var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed : false, position: 'topright'})

layerControl.addTo(map)

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create("div", "legend")
    div.innerHTML += "<b>Legend</b>" + "<br>Green = Less Crashes, Red = More Crashes<br>Triangle = Pedestrian Hit by Car <br>Circle = Biker Hit by Car<br> Red Triangle/Circle = Fatal Crash"
    return div
};

legend.addTo(map);

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


 map.on('overlayadd', function(e){
    if(e.name=='2019'){
        markerClusters.addLayer(collisions2019)
    }
    if(e.name=='2020'){
        markerClusters.addLayer(collisions2020)
    }
    if(e.name=='2021'){
        markerClusters.addLayer(collisions2021)
    }
    if(e.name=='2022'){
        markerClusters.addLayer(collisions2022)
    }
    if(e.name=='2023'){
        markerClusters.addLayer(collisions2023)
    }
 })
 map.on('overlayremove', function(e){
    if(e.name=='2019'){
        markerClusters.removeLayer(collisions2019)
    }
    if(e.name=='2020'){
        markerClusters.removeLayer(collisions2020)
    }
    if(e.name=='2021'){
        markerClusters.removeLayer(collisions2021)
    }
    if(e.name=='2022'){
        markerClusters.removeLayer(collisions2022)
    }
    if(e.name=='2023'){
        markerClusters.removeLayer(collisions2023)
    }
 })

//  map.on('baselayerchange', function(e) {
//     console.log(e.name)
//     if(e.name == "All Crashes"){
//         //see which layers are enabled, then add them to the map
//         if(map.hasLayer(dummy2019)){
            
//         }
//         else{

//         }
//         if(map.hasLayer(dummy2020)){
            
//         }
//         else{

//         }
//         if(map.hasLayer(dummy2021)){
            
//         }
//         else{

//         }
//         if(map.hasLayer(dummy2022)){
            
//         }
//         else{

//         }
//     }
// });
 


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
