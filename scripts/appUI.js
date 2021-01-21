var AppUI = (function () {
    'use strict';

    let elevatorsLocation = []; // Array elevators current location

    /**
     */
    const init = function() {

        elevatorsLocation.length = Config.ELEVATORS_COUNT;
        elevatorsLocation.fill(0);
        renderElevators(Config.ELEVATORS_COUNT);
        renderBuilding(Config.FLOORS_COUNT)
    }
    /**
     * Add the elevators HTML
     * @param {number} elevators
     */
    const renderElevators = function(elevators) {
        let elevatorsHTML = '';
        for(let i = 0; i < elevators; i++) {
            elevatorsHTML += `<div id="elevator-${i}" class="elevator"></div>`;
        }
        document.getElementById('elevator-shaft').innerHTML = elevatorsHTML;
    }
    /**
     * Add the floors HTML
     * @param {number} floors
     */
    const renderBuilding = function(floors) {
        let floorsHTML = '';
        for(let i = floors; i >= 0; i--){
            floorsHTML += `<div id="floor-${i}" class="floor"><div class="seconds"></div><button class="metal linear btn" value="${i}">${i}</button></div>`;
        }
        document.getElementById('building').innerHTML = floorsHTML;
    }
    /**
     * Move given elevator to given floor
     * @param {number} elevatorNum
     * @param {object} destination
     */
    const changeFloorUI = function(elevatorNum, { floor, arrivalTime }){
        const elevator = document.getElementById(`elevator-${elevatorNum}`)
        let time = arrivalTime - Date.now();// - ARRIVAL_WAITING_TIME; //only if last
        elevator.style.transition = `all ${time}ms ease-in-out 500ms` ;
        elevator.style.bottom = `${floor * Config.FLOOR_HEIGHT}px` ;
        elevatorsLocation[elevatorNum] = floor;
    }

    /**
     * Timer UI functionality
     * @param {number} floorNum - floor number of ordered elevator
     * @param {number} seconds - time left to elevator's arrival
     */
    const initElevatorTimer = function(floorNum, seconds) {
        seconds = roundHalf(seconds);
        const floorElem = document.getElementById(`floor-${floorNum}`);
        floorElem.classList.add('queue');
        floorElem.querySelector('.seconds').innerHTML = seconds.toFixed(1);
        var downloadTimer = setInterval(function(){
            if(seconds <= 0){
                clearInterval(downloadTimer);
                floorElem.classList.remove('queue');
            } else {
                floorElem.querySelector('.seconds').innerHTML = seconds.toFixed(1);
            }
            seconds -= 0.5;
        }, 500);
    }

    function roundHalf(num) {
        return Math.round(num*2)/2;
    }

    return {
        init,
        changeFloorUI,
        initElevatorTimer
    }
})();
