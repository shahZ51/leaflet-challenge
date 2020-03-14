

  var gray_background = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "mapbox.light",
    accessToken: API_KEY
  });



  var satellite_background = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });



  var outdoors_background = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  


    var dark_background = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 14,
        id: 'mapbox.dark',
        accessToken: API_KEY
    })
	



var map = L.map("mapid", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [gray_background, satellite_background, outdoors_background, dark_background]
});


gray_background.addTo(map);


var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();


var baseMaps = {
  Satellite: satellite_background,
  Grayscale: gray_background,
  Outdoors: outdoors_background,
  Dark: dark_background
  
};


var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(data) {


  function styleInfo(feature) {
    return {
      opacity: 2,
      fillOpacity: 2,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 1.5
    };
  }

 
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 7:
        return "#ea2c2c";
      case magnitude > 5:
        return "#ee9c00";
      case magnitude > 3:
        return "#f7c59c";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

 

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 2;
  }

 
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 3, 5, 7];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#f7c59c",
      "#ee9c00",
      "#ea2c2c"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(map);

 
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);

      
      tectonicplates.addTo(map);
    });
});
