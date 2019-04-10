var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.source){
            var sources = creep.room.find(FIND_SOURCES);
            var check=[];
                sources.forEach(function(srs){
                    var tmp = creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id})
                    if(tmp == '' || tmp.length == 1){
                        creep.memory.source = srs.id;
                    }
                });
            }

        if(creep.carry.energy < creep.carryCapacity) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES,{filter: (s) => s.id == creep.memory.source});
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source) //, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                for(var target in targets) {
                    var t = targets[target]
                    console.log("Target: " + t)
                    if(creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(t) //, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;