import axios from "axios";
//show object with file geojson
export const _showGEOJSONFILE = (data, Map_Ref) => {
  Map_Ref.current.injectJavaScript(`
  var geo =${JSON.stringify(data)};
  L.geoJSON(geo,{
    onEachFeature:onEachFeature,
    style: function (feature) {	 //qui định style cho các đối tượng
      switch (feature.geometry.type) {
        // case 'Point': return pointStyle;
        case 'LineString':   return lineStyle;
        case 'Polygon':   return polygonStyle;
      }
    }
  }).addTo(mymap);
    `);
};

//show object on map with API data
export const _showDBGeoJSON = (data, Map_Ref) => {
  Map_Ref.current.injectJavaScript(`
  if(drawnItems){
    mymap.removeLayer(drawnItems);
  }
  var geo2=${JSON.stringify(data)};
  var drawnItems = L.featureGroup().addTo(mymap);	

  var geo2Layer = L.geoJSON(geo2,{
          onEachFeature:onEachFeature,
          style: function (feature) {	 //qui định style cho các đối tượng
            switch (feature.geometry.type) {
              case 'LineString':   return lineStyle;
              case 'Polygon':   return polygonStyle;
            }
          },
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
          }
      })
  
    geo2Layer.eachLayer(function(layer) {
        layer.addTo(drawnItems);			
    });
	
	//Các option cho công cụ vẽ
	  var options = {
		position: 'topleft',
		draw: false,
		edit: {
		  featureGroup: drawnItems,	//REQUIRED!!
		}
	}
	var drawControl = new L.Control.Draw(options).addTo(mymap);
  `);
};

//show location GPS on map
export const _showLocationGPS = (location, Map_Ref) => {
  if (!location) {
    console.log("Your browser dont support geolocation feature!");
  } else {
    var lat = location.coords.latitude;
    var long = location.coords.longitude;
    var accuracy = location.coords.accuracy;

    Map_Ref.current.injectJavaScript(`
      var marker, circle;
      if (marker) {
        mymap.removeLayer(marker);
      }
      if (circle) {
        mymap.removeLayer(circle);
      }
        marker = L.marker([${lat}, ${long}]);
        circle = L.circle([${lat}, ${long}], { radius: ${accuracy} });
        var featureGroup = L.featureGroup([marker, circle]).addTo(mymap);
        mymap.fitBounds(featureGroup.getBounds());
    `);
  }
};

export const _refreshMap = async (Map_Ref) => {
  try {
    const result = await axios({
      method: "GET",
      url: "/realestate",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      params: {
        search: "parameter",
      },
    });
    const responseData = result.data;

    Map_Ref.current.injectJavaScript(`
    if(drawnItems){
      mymap.removeLayer(drawnItems);
    }
    var geo2=${JSON.stringify(responseData)};
    var drawnItems = L.featureGroup().addTo(mymap);
  
    var geo2Layer = L.geoJSON(geo2,{
            onEachFeature:onEachFeature,
            style: function (feature) {	 //qui định style cho các đối tượng
              switch (feature.geometry.type) {
                case 'LineString':   return lineStyle;
                case 'Polygon':   return polygonStyle;
              }
            },
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        })
  
      geo2Layer.eachLayer(function(layer) {
          layer.addTo(drawnItems);
      });
  
    //Các option cho công cụ vẽ
      var options = {
    	position: 'topleft',
    	draw: false,
    	edit: {
    	  featureGroup: drawnItems,	//REQUIRED!!
    	}
    }
    var drawControl = new L.Control.Draw(options).addTo(mymap);
    `);
  } catch (err) {
    console.log(err);
  }
};
