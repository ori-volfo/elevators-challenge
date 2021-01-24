var AppController = (function () {
    'use strict';

    let elevators = []; // An array of Elevator objects
    let queuedFloors = []; // An array that lists the floors that have parking elevators or queued

    function init() {

        initFloorsMapping(Config.BUILDINGS);
        createElevators(Config.BUILDINGS);

        AppUI.init();
        attachEvents(Config.BUILDINGS);
    }

    /**
     * Fills the multi-dimensional array 'queuedFloors' according to the 'buildings' array
     * @param {object[]} buildings
     */
    function initFloorsMapping(buildings){
        buildings.forEach(function (building,i){
            queuedFloors[i] = [];
            queuedFloors[i].length = building.floors + 1;
            queuedFloors[i].fill(0);
            queuedFloors[i][0] = building.elevators;
        });
    }

    /**
     * Create Elevator instances
     * @param {object[]} buildings
     */
    function createElevators(buildings){
        buildings.forEach(function (building,i){
            elevators[i] = [];
            for(let j = 0; j < building.elevators; j++) {
                elevators[i].push(new Elevator(0));
            }
        });
    }

    /**
     *
     * @param {object[]}buildings
     */
    function attachEvents(buildings) {
        buildings.forEach(function(buildingObj,i) {
            // Using event delegation by attaching a single event handler
            document.getElementById('floors-'+i).addEventListener('click', function (e) {
                if(e.target.classList.contains('btn')){
                    const [building, requestFloor] = e.target.value.split('-'); // Cast to integer if possible
                    callElevator(+building, +requestFloor);
                }
            })
        });
    }

    /**
     * Gets destination floor and returns the Elevator index with the closest arrival time
     * @param {number} building
     * @param {number} requestFloor
     * @returns {number}
     */
    function findElevator( building,requestFloor) {

        let timeEstimations = [];
        elevators[building].forEach(function (elevator, i) { // Estimate arrival for each elevator
            timeEstimations[i] = elevator.estimateArrivalTime(requestFloor);
        });
        return timeEstimations.indexOf(Math.min(...timeEstimations));

    }

    /**
     * Main logic controller
     * @param {number} building
     * @param {number} requestFloor
     */
    function callElevator( building,requestFloor) {
        if (queuedFloors[building][requestFloor] > 0) { // ignore requests for queued floors
            return;
        }
        const elevatorIndex = findElevator( building, requestFloor ); // Find best candidate
        const arrivalTime = elevators[building][elevatorIndex].addToQueue(requestFloor); // Queue requested floor for best elevator

        queuedFloors[building][requestFloor]++;
        AppUI.initElevatorTimer( building, requestFloor, (arrivalTime - Date.now()) / 1000);

        if (!elevators[building][elevatorIndex].isMoving) { // If elevator is standing still, start journey
            sendElevator( building, elevators[building][elevatorIndex]);
        }
    }

    /**
     * Iterate Elevator queue and play UI + sound
     * @param {number} building
     * @param {Elevator} elevator
     * @return {void}
     */
    async function sendElevator( building, elevator) {
        const now = Date.now();
        const destination = elevator.queue[0];

        elevator.isMoving = true;
        queuedFloors[building][elevator.floor]--;
        AppUI.changeFloorUI( building, elevators[building].indexOf(elevator), destination);

        await timeout(destination.arrivalTime - now); // Wait for animation to end

        elevator.floor = destination.floor; // Update current floor
        ding.playSound();

        await timeout(Config.ARRIVAL_WAITING_TIME); // Elevator stall when reaching destination

        elevator.queue.shift(); // Remove reached destination from queue LIFO
        if (elevator.queue.length < 1) {
            elevator.isMoving = false;
        } else {
            sendElevator( building, elevator);
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
    AppController.init();
});