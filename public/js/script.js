const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}

const map = L.map("map").setView([0, 0], 2); 


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);


const markers = {};


socket.on("receive-location", ({ id, latitude, longitude }) => {
  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }

  if (id === socket.id) {
    map.setView([latitude, longitude]);
  }
});


socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
