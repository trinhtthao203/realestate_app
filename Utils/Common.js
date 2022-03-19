//show object with file geojson
export const _showGEOJSONFILE=(data,Map_Ref)=>{
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
export const _showDBGeoJSON=(data,Map_Ref)=>{
  Map_Ref.current.injectJavaScript(`
    var geo2=${JSON.stringify(data)};
    if (geo2Layer) {
      mymap.removeLayer(geo2Layer);
    }else{
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
    geo2Layer.addTo(mymap);
    }
  `);
}

//show location GPS on map
export const _showLocationGPS=(location, Map_Ref)=>{
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
}  