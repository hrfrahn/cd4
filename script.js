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
wCount = 0
aCount = 0
bCount = 0
nCount = 0
oCount = 0
hCount = 0

mCount = 0 
fCount = 0
function bindPointPopups(feature, layer) {
    if (feature.properties && feature.properties["MO Codes"]) {
        timeStr = feature.properties["Time Occurred"].toString()
        popupText = "At "+timeStr.slice(0,timeStr.length-2)+":"+timeStr.slice(timeStr.length-2,timeStr.length)+" on "+feature.properties["Date Occurred"].slice(0,10)+", a "
        if(feature.properties["Victim Age"]){
            popupText += feature.properties["Victim Age"]+" year old "
        }
        gender = ""
        if(feature.properties["Victim Sex"]=="M"){
            gender = "man "
            mCount += 1
        }
        else if(feature.properties["Victim Sex"]=="F"){
            gender = "woman "
            fCount += 1
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
        switch(feature.properties["vict_descent"]){
            case "W":
                wCount += 1
                break;
            case "H":
                hCount += 1
                break;
            case "A":
            case "C":
            case "D":
            case "F":
            case "G":
            case "J":
            case "K":
            case "L":
            case "P":
            case "S":
            case "U":
            case "V":
            case "Z":
                aCount += 1
                break;
            case "B":
                bCount += 1
                break;
            case "I":
                nCount += 1
                break;
            default:
                oCount += 1
        }

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

function getMarker(shape, color){
    return {
        shape: shape,
        color: "white",
        fillColor: color,
        radius: 6,
        weight: 1,
        opacity: 1,
        fillOpacity: 1}
}


////MO codes: 3003 = ped, 3008 = bike


url = "https://hfrahn.pythonanywhere.com/collisions/"
var fatal = 0
var pedCrash = 0
var bikeCrash = 0
var ksiCrash = 0
var totalcrash = 0
var ageSum = 0

var collisionsArray = []

async function fetchData(years){
    try {
        for(i = 0; i < years.length; i++){
            filePath = "https://hfrahn.pythonanywhere.com/collisions/"+years[i]
            collisionsArray[i] = new L.GeoJSON.AJAX(filePath, {
                onEachFeature: bindPointPopups,
                pointToLayer: function(feature, latlng){
                    totalcrash+=1
                    if(feature.properties["Victim Age"]){
                        ageSum += parseInt(feature.properties["Victim Age"])
                    }
                    //seriously injured crash
                    if(feature.properties["MO Codes"].includes("3024")){
                        ksiCrash += 1
                        if(feature.properties["MO Codes"].includes("3003")){ //ped
                            pedCrash += 1
                            var marker = L.shapeMarker(latlng, getMarker("triangle", "orange"))
                            return marker
                        }
                        bikeCrash+=1
                         var marker = L.circleMarker(latlng, getMarker("circle", "orange"))
                        return marker
                    }
                    else if(feature.properties["MO Codes"].includes("3027")){
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
        }
        return totalcrash
    } 
    catch (err) {
        console.error(err);
    }
}





xhr = new XMLHttpRequest()

var years

xhr.open("GET", "https://hfrahn.pythonanywhere.com/collision_years", true)

xhr.onload = () => {
    years = JSON.parse(xhr.response)
    console.log(years)

    for(i = 0; i < years.length; i++){
        collisionsArray.push(L.marker([0,0]))
    }
    fetchData(years)
        
    
    var markerClusters = L.markerClusterGroup({ maxClusterRadius: 30}).addTo(map);

    var dummyLayers = []
    for(i = 0; i < years.length; i++){
        dummyLayers.push(L.marker([0,0]))
    }

    var overlayMaps = {}
    for(i = 0; i < years.length; i++){
        overlayMaps[years[i]] = dummyLayers[i]
    }

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
     div.innerHTML += "<b>Legend</b>" + "<br>Green = Less Crashes, Red = More Crashes<br>Triangle = Pedestrian Hit by Car <br>Circle = Biker Hit by Car<br> Orange Triangle/Circle = Serious Injury<br>Red Triangle/Circle = Fatal Crash"
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

// add most recent updated time

timeXhr = new XMLHttpRequest()

timeXhr.open("GET", "https://hfrahn.pythonanywhere.com/update_time", true)

timeXhr.onload = () => {
    time = timeXhr.response
    timeHTML = document.getElementById("updateTime")
    timeHTML.innerHTML += time
}

timeXhr.send(null)


// intersectionXhr = new XMLHttpRequest()

// intersectionXhr.open("GET", "http://127.0.0.1:5000/top_intersections", true)

// intersectionXhr.onload = () => {
//     intersections = JSON.parse(intersectionXhr.response)
//     interHTML = document.getElementById("intersection")
//     len = Object.keys(intersections)
//     for(i in len){
//         interHTML.innerHTML += intersections[len[i]].inter + ": (" + intersections[len[i]].count +" crashes)<br>"
//     }
// }

// intersectionXhr.send(null)



//set up stats & charts
//this is done a very stupid way but i really can't figure out js asnyc things lol
//1000 ms = 1 second (should be more than enough time for data to load but can always increase)
setTimeout(() => {
    const ctx = document.getElementById("crashTypeChart")
    otherCrashes = totalcrash - fatal - ksiCrash

    Chart.defaults.font.size = 16

    Chart.defaults.font.family = "Anuphan"
    Chart.defaults.plugins.legend.position = "bottom"

    console.log(Object.keys(collisionsArray[0]._layers).length)
    console.log(collisionsArray[0])

    yearCounts = []

    for(i = 0; i < years.length; i++){
        keys = Object.keys(collisionsArray[i]._layers)
        deathCount = 0
        for(j in keys){
            layer = collisionsArray[i]._layers[keys[j]]
            if(layer.feature.properties["MO Codes"].includes("3027")){
                deathCount +=1
            }
        }
        year = {
            number: years[i],
            count: keys.length,
            deaths: deathCount
        }
        yearCounts.push(year)
        console.log(yearCounts)
    }

    yearCounts.sort((a, b) => a.number - b.number)

    yearCounts[yearCounts.length-1].number += " (YTD)"

    new Chart(ctx, {
        type: 'doughnut', 
        data: {
            labels: [
              'Victim Killed',
              'Victim Seriously Injured',
              'Victim Not Seriously Injured'
            ],
            datasets: [{
              label: ' Crashes',
              data: [fatal, ksiCrash, otherCrashes],
              backgroundColor: [
                'rgb(255, 100, 86)',
                'rgb(255, 241, 138)',
                'rgb(140, 186, 128)'
              ],
              hoverOffset: 4
            }]
        }, 
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Result Of Crash'
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
})

    const modectx = document.getElementById("crashModeChart")
    new Chart(modectx, {
        type: 'doughnut', 
        data: {
            labels: [
              'Biker',
              'Pedestrian'
            ],
            datasets: [{
              label: ' Crashes',
              data: [bikeCrash, pedCrash],
              hoverOffset: 4
            }], 
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Type Of Crash Victim'
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    })


    const lineCtx = document.getElementById("yearLineChart")
    new Chart(lineCtx, {
        type: 'line', 
        data: {
            labels: yearCounts.map(a => a.number),
            datasets: [{
                label: " Crashes",
                data: yearCounts.map(a => a.count),
                yAxisID: 'y'
            }, 
            {
                label: " Deaths",
                data: yearCounts.map(a => a.deaths),
                yAxisID: 'y1'
            }]
        }, 
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Crashes/Deaths'
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }, 
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title:{
                        display: true, 
                        text: "Crashes"
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    title:{
                        display: true, 
                        text: "Deaths"
                    },
                    // grid line settings
                    grid: {
                      drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                },
            }
        }
    })
    avgAge = ageSum / totalcrash

    ageText = document.getElementById("avgAge")
    ageText.innerHTML += parseInt(avgAge)

    totalText = document.getElementById("totalCrashes")
    totalText.innerHTML += totalcrash

    deathText = document.getElementById("totalDeaths")
    deathText.innerHTML += fatal
    

    const raceCtx = document.getElementById("raceBreakdownChart")


    new Chart(raceCtx, {
        type: 'doughnut', 
        data: {
            labels: ['White','Black', 'Hispanic/Latino','Asian American/Pacific Islander','Native American','Other/Unknown'],
            datasets: [{
                label: " Crashes", 
                data: [wCount, bCount, hCount,aCount, nCount, oCount]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Race Of Crash Victim'
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    })

    const genderCtx = document.getElementById("genderBreakdownChart")

    new Chart(genderCtx, {
        type: 'doughnut', 
        data:{
            labels: ["Male", "Female"], 
            datasets: [{
                label: " Crashes", 
                data: [mCount, fCount]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Gender Of Crash Victim'
                },
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    })
    
  }, "2000");
  