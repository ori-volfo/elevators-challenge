var AppUI = (function () {
    'use strict';

    function init() {
        renderBuildings(Config.BUILDINGS);
    }

    /**
     * Add the elevators HTML
     * @param {number} elevators
     * @param {number} buildNum
     * @return {string}
     */
    function renderElevators(elevators,buildNum) {
        let elevatorsHTML = `<div id="elevator-shaft-${buildNum}" class="elevator-shaft">`;
        for (let i = 0; i < elevators; i++) {
            elevatorsHTML += `<div id="elevator-${buildNum}-${i}" class="elevator"></div>`;
        }
        elevatorsHTML += '</div>';
        return elevatorsHTML;
    }

    /**
     * Add the floors HTML
     * @param {number} floors
     * @param {number} buildNum
     * @return {string}
     */
    function renderFloors(floors ,buildNum){
        let floorsHTML = `<div id="floors-${buildNum}" class="floors">`;
        for (let i = floors; i >= 0; i--) {
            floorsHTML += `<div id="floor-${buildNum}-${i}" class="floor"><div class="seconds"></div><button class="metal linear btn" value="${buildNum}-${i}">${i}</button></div>`;
        }
        floorsHTML += '</div>';
        return floorsHTML;
    }
    /**
     * Add the buildings HTML
     * @param {object[]} buildings
     */
    function renderBuildings(buildings) {

        let buildingsHTML = '';
        buildings.forEach(function (building,i){
            buildingsHTML += `<div id="building-${i}" class="building">`;
            buildingsHTML += renderFloors(building.floors, i);
            buildingsHTML += renderElevators(building.elevators, i);
            buildingsHTML += '</div>';
        });
        document.getElementById('main').innerHTML = buildingsHTML;
    }

    /**
     * Move given elevator of a specific building to a given floor
     * @param {number} building
     * @param {number} elevatorNum
     * @param {object} destination
     */
    function changeFloorUI(building, elevatorNum, {floor, arrivalTime}) {
        const elevator = document.getElementById(`elevator-${building}-${elevatorNum}`)
        const time = arrivalTime - Date.now();

        elevator.style.transition = `all ${time}ms ease-in-out 500ms`;
        elevator.style.bottom = `${floor * Config.FLOOR_HEIGHT}px`;
    }

    /**
     * Timer UI functionality
     * @param {number} building - building number of ordered elevator
     * @param {number} floor - floor number of ordered elevator
     * @param {number} seconds - time left to elevator's arrival
     */
    function initElevatorTimer( building, floor, seconds ) {
        seconds = roundHalf(seconds);
        const floorElem = document.getElementById(`floor-${building}-${floor}`);

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

    /**
     * @param {number} num
     * @return {number}
     */
    function roundHalf(num) {
        return Math.round(num * 2) / 2;
    }

    return {
        init,
        changeFloorUI,
        initElevatorTimer
    }
})();
