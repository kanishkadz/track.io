const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
    })
}