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

//Hiển thị vị trí GPS lên map
//Màn hình MapScreen -> Đánh dấu/ Zoom vị trí GPS của người dùng
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

//Hiển thị các đối tượng trên MapScreen
//Xử lí html leaflet của MapScreen -> Hiển thị dlieu lên Map với 2 player cho người dùng
export const _showMapScreen = async (Map_Ref) => {
  try {
    //Tải các dữ liệu bds về
    const RealEstate = await axios({
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
    const responseRE = RealEstate.data;

    //Tải các dữ liệu vqh về
    const PlanningArea = await axios({
      method: "GET",
      url: "/planning-area",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      params: {
        search: "parameter",
      },
    });
    const responsePA = PlanningArea.data;

    Map_Ref.current.injectJavaScript(`
    
    if(layerControl){
      mymap.removeControl(layerControl);
      mymap.removeLayer(grpRE);
      mymap.removeLayer(grpPA);
    }
    var layerControl ;
    var geoRE=${JSON.stringify(responseRE)};
    var geoPA=${JSON.stringify(responsePA)};
    
    //Định các style cho point, line và polygon
    var lineStyle={color: "blue", weight: 5};
    var lineStylePA={color: "red", weight: 5};
    var polygonStyle={color: "pink", fillColor: "black", weight: 4};
    var polygonStylePA={color: "yellow", fillColor: "blue", weight: 4};
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    function onEachFeature(feature, layer) {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.name ) {
        layer.bindPopup('<h3>'+feature.properties.name+'</h3>');
      }
    }
    var geoRELayer = L.geoJSON(geoRE,{
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

      function onEachFeaturePA(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.name ) {
          layer.bindPopup('<h3>'+feature.properties.name+'</h3>'+
          '<h5>Địa chỉ: '+feature.properties.diachi+'</h5>'+
          '<h5>Mô tả: '+feature.properties.mota+'</h5>');
        }
      }
      
      var geoPALayer = L.geoJSON(geoPA,{
        onEachFeature:onEachFeaturePA,
        style: function (feature) {
          switch (feature.geometry.type) {
            case 'LineString':   return lineStylePA;
            case 'Polygon':   return polygonStylePA;
          }
        },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      })
      
      var grpRE = L.layerGroup();
      geoRELayer.eachLayer(function(layer) {
        layer.addTo(grpRE);
      });
      
      var grpPA = L.layerGroup();
      geoPALayer.eachLayer(function(layer) {
        layer.addTo(grpPA);
      });
      
      var baseMaps = {
        "OSM": osm,
      };
      
      var overlayMaps = {
        "Bất động sản": grpRE,
        "Vùng quy hoạch": grpPA
      };
      
      layerControl = L.control.layers(baseMaps, overlayMaps).addTo(mymap);
      `);
  } catch (err) {
    console.log(err);
  }
};

//Hiển thị các đối tượng trên RealEstate
export const _showRealEstate = async (Map_Ref) => {
  //Get data Real Estate
  const RealEstate = await axios({
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
  const responseRE = RealEstate.data;

  Map_Ref.current.injectJavaScript(`
    if(realEstate){
      mymap.removeLayer(realEstate);
    }

    var realEstate = L.featureGroup().addTo(mymap);	
    var geoRE=${JSON.stringify(responseRE)};

    function handleUpdateName(id){
      window.ReactNativeWebView.postMessage(JSON.stringify("name "+id));
    }

    function handleDel(id){
      window.ReactNativeWebView.postMessage(id);
    }

    function onEachFeatureRE(feature, layer) {
      if (feature.properties && feature.properties.name ) {
        layer.bindPopup('<h5>'+feature.properties.name+'</h5>'+
          '<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleUpdateName('+feature.properties.id+')">Sửa tên</button>'+ ' ' +
          '<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleDel('+feature.properties.id+')">Xóa</button>'
          );
      }
    }

    var geoRELayer = L.geoJSON(geoRE,{
      onEachFeature:onEachFeatureRE,
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

    geoRELayer.eachLayer(function(layer) {
        layer.addTo(realEstate);
    });
  `);
};

//Hiển thị các đối tượng trên PlanningArea
export const _showPlanningArea = async (Map_Ref) => {
  //Tải các dữ liệu VQH về
  const PlanningArea = await axios({
    method: "GET",
    url: "/planning-area",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    params: {
      search: "parameter",
    },
  });
  const responsePA = PlanningArea.data;

  Map_Ref.current.injectJavaScript(`
      if(planningArea){
        mymap.removeLayer(planningArea);
      }
  
      var planningArea = L.featureGroup().addTo(mymap);	
      var geoPA=${JSON.stringify(responsePA)};
  
      function handleUpdate(id){
        window.ReactNativeWebView.postMessage(JSON.stringify("name "+id));
      }
  
      function handleDel(id){
        window.ReactNativeWebView.postMessage(id);
      }
  
      function onEachFeaturePA(feature, layer) {
        if (feature.properties && feature.properties.name ) {
          layer.bindPopup('<h5>'+feature.properties.name+'</h5>'+
            '<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleUpdate('+feature.properties.idvqh+')">Sửa thông tin</button>'+ ' ' +
            '<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleDel('+feature.properties.idvqh+')">Xóa</button>'
            );
        }
      }
  
      var geoPALayer = L.geoJSON(geoPA,{
        onEachFeature:onEachFeaturePA,
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
  
      geoPALayer.eachLayer(function(layer) {
          layer.addTo(planningArea);
      });
    `);
};

function isMarkerInsidePolygon(marker, poly) {
  var polyPoints = poly.getLatLngs()[0];
  var x = marker.getLatLng().lat,
    y = marker.getLatLng().lng;

  var inside = false;
  for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    var xi = polyPoints[i].lat,
      yi = polyPoints[i].lng;
    var xj = polyPoints[j].lat,
      yj = polyPoints[j].lng;

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
