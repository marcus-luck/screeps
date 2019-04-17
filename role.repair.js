var roleUpgrader = require('role.upgrader');

var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.carry.energy == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.say('🔄 ÄTA!');
        }
        else if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
            creep.memory.working = true
            creep.say('Reparera');
        }


        if (creep.memory.working == true){
            var toRepair = creep.room.find(FIND_STRUCTURES, { 
                    filter: (structure) => { 
                        return (structure.hits < 650 && structure.hits > 0)
                    }
                });

            if (toRepair.length > 0){
                console.log(toRepair);
                if (creep.repair(toRepair[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(toRepair[0]);
                }
            } else {
            
                var toRepair = creep.room.find(FIND_STRUCTURES, { 
                    filter: (structure) => { 
                        return (structure.hits < structure.hitsMax && structure.hits > 0 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                    }
                });
                
                var wallToRepair = creep.room.find(FIND_STRUCTURES, { 
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax && structure.hits > 0 || structure.hits < structure.hitsMax && structure.hits > 0 && structure.structureType == STRUCTURE_WALL)
                    }
                });
                
                if(toRepair.length > 0){
                    if (creep.repair(toRepair[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(toRepair[0]);
                    }
                } else {
                
                    if (wallToRepair.length > 0){
                        if (creep.repair(wallToRepair[wallToRepair.length - 1]) == ERR_NOT_IN_RANGE) { //omgekeerde volgorde zodat ramparts eerst gerepaird worden
                            creep.moveTo(wallToRepair[0]);
                        }
                    } else {
                        roleUpgrader.run(creep); // so it will alway's will be busy. DO NOT FORGET TO IMPORT(var roleHarvester = require('role.harvester');) IT 
                    }
                }
            }
        }

        if(creep.memory.working == false){
            if(!creep.memory.sourceId){
                var sources = creep.room.find(FIND_SOURCES);

                var pop = Object.keys(Game.creeps).length;
                var s_len = sources.length;
                var wrks = Math.floor(pop / s_len);

                sources.forEach(function(srs){
                    var tmp = creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.sourceId == srs.id})
                    if(tmp == '' || tmp.length <= wrks){
                        creep.memory.sourceId = srs.id;
                    }
                });
            }
            else{
                var source = Game.getObjectById(creep.memory.sourceId);
            }
            
            if(!source){
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
            }
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source); //, {visualizePathStyle: {stroke: '#ffaa00'}});
            } 
        }
    }
}

module.exports = roleRepair;