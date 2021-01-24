# Elevators Challenge
Multiple elevators algorithm

This script is a challenge that's meant to test deep understanding of JavaScript,  
capabilities of complex algorithm scripting using data structure, and a basic knowledge 
of CSS + HTML.

## Goal
Design and build an elevator logic, with a configurable amount of buildings and a configurable amount of 
floors and elevators.
The elevators must work together in order to serve in optimal time.
An elevator can and should queue a floor if it's on the move, and it's the optimal elevator.
Each floor travel is 500ms, and when arriving to a destination the elevators must wait for a minimum of 
2 seconds.


## Prerequisites
* A modern Chrome browser.

## Configurations
Inside the `scripts/config.js` the config object holds the settings for this challenge.
The `BUILDINGS` variable holds an array of building objects, with the amount of floors and elevators.
An array of `[{floors:9,elevators:3},{floors:5,elevators:2}]`, will result in rendering 2 buildings. the first with 9 floors and 3 elevators, and the second building will have 5 floors and 2 elevators.

Entry point is at `index.html`.

### Disclaimer
* The layout is not designed to be responsive. With more buildings and elevators, the layout will need a wider screen.
* The code was designed and developed on a modern Chrome browser (V87). Various browser adjustments were not taken in concern. 