/// <reference path="Screeps-Typescript-Declarations-master\dist\screeps.d.ts"/>
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDistHarvester = require('role.distharvest');

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
    console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
    console.log('Upgraders: ' + harvesters.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
    console.log('Builders: ' + builders.length);
    var distharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'distharvester')
    console.log('DistHarvester: ' + distharvesters.length);

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if(Game.spawns.Spawn1.energy >= 300 && harvesters.length < 6) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}});        
    }

    // if(Game.spawns.Spawn1.energy >= 300 && distharvesters.length < 4) {
    //     var newName = 'DistHarvester' + Game.time;
    //     console.log('Spawning new DistHarvester: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
    //         {memory: {role: 'distharvester'}});
    // }

    if(Game.spawns.Spawn1.energy >= 300 && upgraders.length < 6) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});        
    }
 
    if(Game.spawns.Spawn1.energy >= 300 && builders.length < 4) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});        
    }

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
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
        // if(creep.memory.role == 'distharvester') {
        //     roleDistHarvester.run(creep);
        // }
    }


    var showpopulations = 'yes'
    // population calculation
    var pop = Object.keys(Game.creeps).length
    var harvesterpop = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var builderpop = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var upgraderpop = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    if (showpopulations == 'yes'){
        console.log("H: " + harvesterpop + ' B: ' + builderpop + ' U: ' + upgraderpop + ' Tot: ' + pop);
    }

}