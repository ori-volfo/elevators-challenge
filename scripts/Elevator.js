class Elevator {
    'use strict';
    isMoving = false;

    constructor(_floor ) {
        this.floor = _floor; // Current floor
        this.queue = []; // An array of objects {floor,arrivalTime}
    }

    /**
     * Adds a destination floor to the elevator queue
     * @param {number} requestFloor
     * @return {Date}
     */
    addToQueue(requestFloor) {
        let arrivalTime = this.estimateArrivalTime(requestFloor);
        this.queue.push({floor: requestFloor, arrivalTime});
        return arrivalTime;
    }

    /**
     * Returns the arrival time according to the destination
     * @param {number} requestFloor
     * @return {Date}
     */
    estimateArrivalTime(requestFloor) {
        let estimatedTime;

        if (this.queue < 1) {
            const distance = Math.abs(requestFloor - this.floor);
            estimatedTime = Date.now() + (distance * Config.TRAVEL_TIME);
        } else {
            const distance = Math.abs(requestFloor - this.getLastQueueItem().floor);
            const departureTime = this.getLastQueueItem().arrivalTime;
            estimatedTime = departureTime + (distance * Config.TRAVEL_TIME) + Config.ARRIVAL_WAITING_TIME;
        }
        return estimatedTime;
    }

    /**
     * returns the last floor and arrival time object
     * @return {object}
     */
    getLastQueueItem() {
        return this.queue[this.queue.length - 1]
    }

}
