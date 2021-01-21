class Elevator {
    isMoving = false;

    constructor(_floor, _direction) {
        this.floor = _floor;
        this.queue = [];
    }

    addToQueue(requestFloor){
        let arrivalTime = this.estimateArrivalTime(requestFloor);
        this.queue.push({floor:requestFloor,arrivalTime});
        return arrivalTime;
    }

    estimateArrivalTime(requestFloor){
        let estimatedTime;
        if(this.queue < 1){
            const distance = Math.abs(requestFloor - this.floor);
            estimatedTime = Date.now() + (distance * Config.TRAVEL_TIME);
        }
        else {
            const distance = Math.abs(requestFloor - this.getLastQueueItem().floor);
            const departureTime = this.getLastQueueItem().arrivalTime;
            estimatedTime = departureTime + (distance * Config.TRAVEL_TIME) + Config.ARRIVAL_WAITING_TIME;
        }
        return estimatedTime;
    }

    getLastQueueItem(){
        return this.queue[this.queue.length - 1]
    }

}
