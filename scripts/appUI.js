var AppUI = (function () {
    'use strict';

    let elevatorsLocation = []; // Array elevators current location

    function init() {

        elevatorsLocation.length = Config.ELEVATORS_COUNT;
        elevatorsLocation.fill(0);
        renderElevators(Config.ELEVATORS_COUNT);
        renderBuilding(Config.FLOORS_COUNT)
    }

    /**
     * Add the elevators HTML
     * @param {number} elevators
     */
    function renderElevators(elevators) {
        let elevatorsHTML = '';
        for (let i = 0; i < elevators; i++) {
            elevatorsHTML += `<div id="elevator-${i}" class="elevator"></div>`;
        }
        document.getElementById('elevator-shaft').innerHTML = elevatorsHTML;
    }

    /**
     * Add the floors HTML
     * @param {number} floors
     */
    function renderBuilding(floors) {
        let floorsHTML = '';
        for (let i = floors; i >= 0; i--) {
            floorsHTML += `<div id="floor-${i}" class="floor"><div class="seconds"></div><button class="metal linear btn" value="${i}">${i}</button></div>`;
        }
        document.getElementById('floors').innerHTML = floorsHTML;
    }

    /**
     * Move given elevator to given floor
     * @param {number} elevatorNum
     * @param {object} destination
     */
    function changeFloorUI(elevatorNum, {floor, arrivalTime}) {
        const elevator = document.getElementById(`elevator-${elevatorNum}`)
        const time = arrivalTime - Date.now();

        elevator.style.transition = `all ${time}ms ease-in-out 500ms`;
        elevator.style.bottom = `${floor * Config.FLOOR_HEIGHT}px`;
        elevatorsLocation[elevatorNum] = floor;
    }

    /**
     * Timer UI functionality
     * @param {number} floorNum - floor number of ordered elevator
     * @param {number} seconds - time left to elevator's arrival
     */
    function initElevatorTimer(floorNum, seconds) {
        seconds = roundHalf(seconds);
        const floorElem = document.getElementById(`floor-${floorNum}`);

        floorElem.classList.add('queue');
        floorElem.querySelector('.seconds').innerHTML = seconds.toFixed(1);

        let downloadTimer = setInterval(function () {
            if (seconds <= 0) {
                clearInterval(downloadTimer);
                floorElem.classList.remove('queue');
            } else {
                floorElem.querySelector('.seconds').innerHTML = seconds.toFixed(1);
            }
            seconds -= 0.5;
        }, 500);
    }

    function roundHalf(num) {
        return Math.round(num * 2) / 2;
    }

    return {
        init,
        changeFloorUI,
        initElevatorTimer
    }
})();
