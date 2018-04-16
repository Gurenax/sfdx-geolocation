({
  jsLoaded: function(component, event, helper) {
    var map = L.map('map', { zoomControl: false }).setView([37.784173, -122.401557], 14)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles © Esri'
      }).addTo(map)
    component.set('v.map', map)
  }
})
