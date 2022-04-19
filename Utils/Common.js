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
export const _showDBGeoJSON = async (Map_Ref) => {
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
    var drawnItems;
    var drawControl;

    if(drawnItems){
      mymap.removeLayer(drawnItems);
    }
    if(drawControl){
      mymap.removeControl(drawControl);
    }
    var geo2=${JSON.stringify(responseData)};
    drawnItems = L.featureGroup().addTo(mymap);
  
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
    drawControl = new L.Control.Draw(options).addTo(mymap);
    `);
  } catch (err) {
    console.log(err);
  }
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
        circle = L.circle([${lat}, ${long}], { radius: ${accuracy}/100 });
        var featureGroup = L.featureGroup([marker, circle]).addTo(mymap);
        mymap.fitBounds(featureGroup.getBounds());
    `);
  }
};

export const _setToolPoint = (Map_Ref) => {
  Map_Ref.current.injectJavaScript(`
    var drawnItems;
    var drawControl;

    if(drawnItems){
      mymap.removeLayer(drawnItems);
    }
    if(drawControl){
      mymap.removeControl(drawControl);
    }

    //khai báo featuregroup để vẽ
    drawnItems = L.featureGroup().addTo(mymap);	
          
    //Các option cho công cụ vẽ
    var options = {
      position: 'topleft',
      draw: {
			  marker:true,
        polygon: false,
        polyline: false,
        circle:false,
        rectangle:false
      },
      edit: {
        featureGroup: drawnItems,	//REQUIRED!!
        delete:true,
        edit:true
      }
    };
    drawControl = new L.Control.Draw(options).addTo(mymap);
 `);
};

export const _setToolLineString = (Map_Ref) => {
  Map_Ref.current.injectJavaScript(`
  var drawnItems;
  var drawControl;

  if(drawnItems){
    mymap.removeLayer(drawnItems);
  }
  if(drawControl){
    mymap.removeControl(drawControl);
  }

  //khai báo featuregroup để vẽ
  drawnItems = L.featureGroup().addTo(mymap);	
      
  //Các option cho công cụ vẽ
	var options = {
		position: 'topleft',
		draw: {
			polygon: false,
			polyline: true,
			circle:false,
			rectangle:false,
			marker:false,
		},
		edit: {
			featureGroup: drawnItems,	//REQUIRED!!
			delete:true,
			edit:true
		}
	};
  drawControl = new L.Control.Draw(options).addTo(mymap);
  `);
};

export const _setToolPolygon = (Map_Ref) => {
  Map_Ref.current.injectJavaScript(`
    var drawnItems;
    var drawControl;

    if(drawnItems){
      mymap.removeLayer(drawnItems);
    }
    if(drawControl){
      mymap.removeControl(drawControl);
    }

    //khai báo featuregroup để vẽ
    drawnItems = L.featureGroup().addTo(mymap);	
          
    //Các option cho công cụ vẽ
    var options = {
      position: 'topleft',
      draw: {
        polygon: true,
        polyline: false,
        circle:false,
        rectangle:true,
        marker:false,
      },
      edit: {
        featureGroup: drawnItems,	//REQUIRED!!
        delete:true,
        edit:true
      }
    };
    drawControl = new L.Control.Draw(options).addTo(mymap);
 `);
};
