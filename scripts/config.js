const Config = {
    BUILDINGS: [{floors:9,elevators:3},{floors:5,elevators:2}], // An array of buildings. Each building object holds the number of floors and elevators.

    TRAVEL_TIME: 500, // The amount of time it takes to travel a floor, in milliseconds
    ARRIVAL_WAITING_TIME: 2000, // The amount of time the elevator waits at arrival, in milliseconds
    FLOOR_HEIGHT: 110, // Floor height in pixels. Must match CSS.
}

const ding = new Audio('./assets/ding.mp3');

Audio.prototype.playSound = function() {
    this.pause();
    this.currentTime = 0;
    this.play();
};