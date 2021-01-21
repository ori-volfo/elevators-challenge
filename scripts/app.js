var App = (function () {
    'use strict';

    const ding = new Audio('./assets/ding.mp3');
    let elevators = [];
    let queuedFloors = [];

    const init = function(){

        queuedFloors.length = Config.FLOORS_COUNT + 1;
        queuedFloors.fill(0);
        queuedFloors[0] = Config.ELEVATORS_COUNT;

        for (let i = 0; i < Config.ELEVATORS_COUNT; i++){
            elevators.push(new Elevator(0));
        }
        AppUI.init();
        attachEvents();
    }
    /**
     * Gets destination floor and returns the Elevator index with the closest arrival time
     * @param {number} requestFloor
     * @returns {number}
     */
    const findElevator = function(requestFloor) {

        let timeEstimations = [];
        elevators.forEach(function(elevator, i) {
            timeEstimations[i] = elevator.estimateArrivalTime(requestFloor);
        });
        return timeEstimations.indexOf(Math.min(...timeEstimations));

    }

    const attachEvents = function() {
        // Using event delegation by attaching a single event handler
        document.getElementById('building').addEventListener('click', function(e){
            const requestFloor = +e.target.value; // Cast to integer if possible
            Number.isInteger(requestFloor) && callElevator(requestFloor);
        })
    }
    /**
     *
     * @param {number} requestFloor
     */
    const callElevator = async function(requestFloor){

        if(queuedFloors[requestFloor] > 0){ // ignore requests for queued floors
            return;
        }

        const elevatorToOrder = findElevator(requestFloor);
        const arrivalTime = elevators[elevatorToOrder].addToQueue(requestFloor);

        queuedFloors[requestFloor]++;

        AppUI.initElevatorTimer(requestFloor, (arrivalTime - Date.now())/1000);
        if(!elevators[elevatorToOrder].isMoving){
            await sendElevator(elevators[elevatorToOrder])
        }
    }
    /**
     *
     * @param {Elevator} elevator
     * @returns {Promise<void>}
     */
    const sendElevator = async function(elevator) {
        const now = Date.now();
        const destination = elevator.queue[0];

        elevator.isMoving = true;
        queuedFloors[elevator.floor]--;

        AppUI.changeFloorUI(elevators.indexOf(elevator), destination);
        await timeout(destination.arrivalTime - now); // Wait for animation to end
        elevator.floor = destination.floor; // Update current floor
        // ding.playSound();

        await timeout(Config.ARRIVAL_WAITING_TIME); // Elevator stall when reaching destination
        elevator.queue.shift(); // Remove reached destination from queue LIFO

        if(elevator.queue.length < 1){
            elevator.isMoving = false;
        }
        else{
            await sendElevator(elevator);
        }
    }
    /**
     *
     * @param {number} ms
     * @returns {Promise}
     */
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        init
    }
})();


window.addEventListener('load', function(){
    App.init();
});

Audio.prototype.playSound = function() {
    this.pause();
    this.currentTime = 0;
    this.play();
};