const html_script = `
<!DOCTYPE html>
<html>
<head>
	
	<title>Quick Start - Leaflet</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="initial-scale=1.0">
	
	<link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
	<script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js" integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.js"></script>
	<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.2/dist/leaflet.draw.css" />
</head>
<style>	
        #combobox1 {
            padding: 6px 8px;
            font: 14px/16px Arial, Helvetica, sans-serif;
            background-color: rgba(255,255,255,0.8);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 5px;
        }
    </style>
<body style="padding: 0; margin: 0">
<div id="mapid" style="width: 100%; height: 100vh;"></div>
<script>
	var mymap = L.map('mapid').setView([10.030249,105.772097], 17);
	var osm = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; OpenStreetMap contributors, ',
		id: 'mapbox/streets-v11'
	})
	osm.addTo(mymap);

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
		if (feature.properties && feature.properties.name) {
			layer.bindPopup(feature.properties.name);
		}
	}

	var popup = L.popup();
	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(mymap);
	}
	mymap.on('click', onMapClick);
	
		
	//Định các style cho point, line và polygon
	var lineStyle={color: "blue", weight: 2};
	var polygonStyle={color: "pink", fillColor: "black", weight: 4};

	//Add GeoJSON lên bản đồ
	var Geo={
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {
				  "type": "Point",
				  "coordinates": [
					105.773492,
					10.031844
				  ]
				},
				"properties": {
				  "name": "Sở GDĐT Cần Thơ","show_on_map": true
				}
			  },
			  {
				"type": "Feature",
				"geometry": {
				  "type": "LineString",
				  "coordinates": [
					[
					  105.767838,
					  10.02859
					],
					[
					  105.769329,
					  10.029097
					]
				  ]
				},
				"properties": {
				  "name": "Đường mới","show_on_map": true
				}
			  },
			  {
				"type": "Feature",
				"geometry": {
				  "type": "Polygon",
				  "coordinates": [
					[
					  [
						105.76913,
						10.031537
					  ],
					  [
						105.768696,
						10.030972
					  ],
					  [
						105.76905,
						10.030644
					  ],
					  [
						105.769538,
						10.031204
					  ],
					  [
						105.76913,
						10.031537
					  ]
					]
				  ]
				},
				"properties": {
				  "name": "Khoa CNTT - TT","show_on_map": true
				}
			  }
		  ]
		}
		
		// L.geoJSON(Geo,{
		// 	onEachFeature:onEachFeature,
		// 	style: function (feature) {	 //qui định style cho các đối tượng
		// 		switch (feature.geometry.type) {
		// 			// case 'Point': return pointStyle;
		// 			case 'LineString':   return lineStyle;
		// 			case 'Polygon':   return polygonStyle;
		// 		}
		// 	},
		// 	pointToLayer: function (feature, latlng) {
		// 		return L.circleMarker(latlng, geojsonMarkerOptions);
		// 	},
		// 	filter: function(feature, layer) {
		// 		return feature.properties.show_on_map;
		// 	}
		// 	}).addTo(mymap);
			
		// //Hiển thị tất cả đối tượng lên bản đồ
	// var urlGeoJSON = "https://raw.githubusercontent.com/trinhtthao203/nodejs_blog/main/dulieumau.geojson";
	// $.getJSON(urlGeoJSON , function(data) {
	// 	L.geoJSON(data, {
	// 		style: function (feature) {	 //qui định style cho các đối tượng
	// 			switch (feature.geometry.type) {
	// 				case 'LineString':   return lineStyle;
	// 				case 'Polygon':   return polygonStyle;
	// 			}
	// 		},
	// 		//Có thể chủ động icon cho point
	// 		//pointToLayer: function (feature, latlng){
	// 		//						return L.marker(latlng, {icon:pointStyle});			
	// 		//},
	// 		//icon mặc định trong css/images
	// 		onEachFeature: function(feature, layer) {	//Mỗi đối tượng thêm popup vào
	// 			if (feature.properties && feature.properties.name) {	//Có properties và có name
	// 				layer.bindPopup("<i>" + feature.properties.name + "</i>");
	// 			}
	// 		}
	// 	}).addTo(mymap);
	// });
			


</script>
</body>
</html>
`;

export default html_script;
