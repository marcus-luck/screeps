/// <reference path="Screeps-Typescript-Declarations-master\dist\screeps.d.ts"/>
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roomControl = require('room.control');
var towerControl = require('tower.control');
// var roleDistHarvester = require('role.distharvest');

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);

    // var distharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'distharvester')

    for(var tower in towers) {
        towerControl.run(towers[tower])
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Check pop and build new
    var myRooms = _.filter(Game.rooms, (r) => {return (r.name == 'W7N3' || r.name == 'W8N3')}); //.find(FIND_SOURCES);
    roomControl.run(myRooms[0]);
    
    // Run all creeps!
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
    }

    var showpopulations = true;
    // population calculation
    var pop = Object.keys(Game.creeps).length;
    var harvesterpop = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var builderpop = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var upgraderpop = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var rpop = _.sum(Game.creeps, (c) => c.memory.role == 'repair');
    if (showpopulations){
        console.log("H: " + harvesterpop + ' B: ' + builderpop + ' U: ' + upgraderpop + ' R: ' + rpop + ' Tot: ' + pop);
    }
}

