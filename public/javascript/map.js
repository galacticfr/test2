mapboxgl.accessToken = map_token;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: camp.geometry.coordinates,
    zoom: 8
});

map.addControl(new mapboxgl.NavigationControl());

// Create a default Marker and add it to the map.
new mapboxgl.Marker({
    color: "#e71d36",
})
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 30 })
            .setHTML(
                `<h6><b>${camp.title}</b></h6><div>${camp.location}</div>`
            )
    )
    .addTo(map);