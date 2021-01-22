var App = (function () {
    'use strict';

    let elevators = []; // An array of Elevator objects
    let queuedFloors = []; // An array that lists the floors that have elevators queued or waiting

    function init() {

        queuedFloors.length = Config.FLOORS_COUNT + 1;
        queuedFloors.fill(0);
        queuedFloors[0] = Config.ELEVATORS_COUNT;

        for (let i = 0; i < Config.ELEVATORS_COUNT; i++) {
            elevators.push(new Elevator(0));
        }
        AppUI.init();
        attachEvents();
    }

    function attachEvents() {
        // Using event delegation by attaching a single event handler
        document.querySelector('.building .floors').addEventListener('click', function (e) {
            const requestFloor = +e.target.value; // Cast to integer if possible
            Number.isInteger(requestFloor) && callElevator(requestFloor);
        })
    }

    /**
     * Gets destination floor and returns the Elevator index with the closest arrival time
     * @param {number} requestFloor
     * @returns {number}
     */
    function findElevator(requestFloor) {

        let timeEstimations = [];
        elevators.forEach(function (elevator, i) { // Estimate arrival for each elevator
            timeEstimations[i] = elevator.estimateArrivalTime(requestFloor);
        });
        return timeEstimations.indexOf(Math.min(...timeEstimations));

    }

    /**
     * Main logic controller
     * @param {number} requestFloor
     */
    function callElevator(requestFloor) {

        if (queuedFloors[requestFloor] > 0) { // ignore requests for queued floors
            return;
        }

        const elevatorIndex = findElevator(requestFloor); // Find best candidate
        const arrivalTime = elevators[elevatorIndex].addToQueue(requestFloor); // Queue requested floor for best elevator

        queuedFloors[requestFloor]++;

        AppUI.initElevatorTimer(requestFloor, (arrivalTime - Date.now()) / 1000);

        if (!elevators[elevatorIndex].isMoving) { // If elevator is standing still, start journey
            sendElevator(elevators[elevatorIndex]);
        }
    }

    /**
     * Iterate Elevator queue and play UI + sound
     * @param {Elevator} elevator
     * @return {void}
     */
    async function sendElevator(elevator) {
        const now = Date.now();
        const destination = elevator.queue[0];

        elevator.isMoving = true;
        queuedFloors[elevator.floor]--;

        AppUI.changeFloorUI(elevators.indexOf(elevator), destination);
        await timeout(destination.arrivalTime - now); // Wait for animation to end

        elevator.floor = destination.floor; // Update current floor
        ding.playSound();

        await timeout(Config.ARRIVAL_WAITING_TIME); // Elevator stall when reaching destination
        elevator.queue.shift(); // Remove reached destination from queue LIFO

        if (elevator.queue.length < 1) {
            elevator.isMoving = false;
        } else {
            sendElevator(elevator);
        }
    }

    /**
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


window.addEventListener('load', function () {
    App.init();
});