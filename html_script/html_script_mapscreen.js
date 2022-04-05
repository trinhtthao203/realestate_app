const html_script_mapscreen = `
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
<script src="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.js"></script> 
<script src="https://leaflet.github.io/Leaflet.draw/src/Leaflet.Draw.Event.js"></script> 
<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.0/dist/leaflet.draw.css"> 
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

	function handleUpdateName(id){
		window.ReactNativeWebView.postMessage(id);
	}

	function onEachFeature(feature, layer) {
		// does this feature have a property named popupContent?
		if (feature.properties && feature.properties.name ) {
			layer.bindPopup('<h3>'+feature.properties.name+'</h3>'+
				'<button type="button" class="btn btn-primary sidebar-open-button" onclick="handleUpdateName('+feature.properties.id+')">Sửa tên</button>'
				);
		}
	}

	//Định các style cho point, line và polygon
	var lineStyle={color: "blue", weight: 5};
	var polygonStyle={color: "pink", fillColor: "black", weight: 4};

	var listID=[];
	//Xử lí khi xóa
	function handleDEL(id,name, layer) {
		var result = confirm("Chắc chắn xóa ? "+ name);
		if(result){
			listID.push(id);
		}else{
			layer.addTo(drawnItems);
			alert('Hủy xóa !');
		}
	}
	
	function delText(e) {
		var layers = e.layers;		
		layers.eachLayer(function (layer) {
			drawnItems.removeLayer(layer);
			var collection = layer.toGeoJSON();
			var id = JSON.stringify(collection.properties.id, null, 2);
			var name = JSON.stringify(collection.properties.name, null, 2);
			handleDEL(id,name,layer);
		});
		var idJSON = JSON.stringify(listID, null, 2);
		window.ReactNativeWebView.postMessage(idJSON);
	}

	//Khi xóa thì bớt ở lớp drawnItems
	mymap.on('draw:deleted', delText);
	
	//Khi EDIT
	//Layer chứa các items edit
	var editItems = L.featureGroup().addTo(mymap);	

	//function xử lý edit
	function editText(e) {
		let layers = e.layers;
		var collection = layers.toGeoJSON();
		var geojson = JSON.stringify(collection, null, 2);
		window.ReactNativeWebView.postMessage(geojson);
	}
	mymap.on('draw:edited', editText);

</script>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
`;

export default html_script_mapscreen;
