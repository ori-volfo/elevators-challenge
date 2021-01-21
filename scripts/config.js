const Config = {
    ELEVATORS_COUNT: 3, // The amount of elevators
    FLOORS_COUNT: 9,  // The amount of floors

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