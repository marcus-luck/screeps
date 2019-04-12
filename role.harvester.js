var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Test trash
        // var sources = creep.room.find(FIND_SOURCES);
        // sources.forEach(function(srs){
        //     console.log("BAH: "+ creep.room.find(FIND_MY_CREEPS, {filter: (s) => s.memory.source == srs.id}));
        // });
        
        // Simple state machine... two states
        if(creep.carry.energy == 0 && creep.memory.working == true) {
            creep.memory.working = false;
            creep.say('🔄 ÄTA!');
        }
        else if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
            creep.memory.working = true
            creep.say('no play :(');
        }
        
        if(creep.memory.working == true){
            // If no memory of a target, update memory
            if(!creep.memory.targetId){
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if(targets.length > 0) {
                    creep.memory.targetId = targets[0].id;
                }
                else{
                    creep.memory.targetId = Game.flags['idlers'].id;
                }

            }
            else{
                var t = Game.getObjectById(creep.memory.targetId);
                // console.log("Target: " + t)
                if(creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t); //, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.transfer(t, RESOURCE_ENERGY) == ERR_FULL) {
                    creep.memory.targetId = '';
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
};

module.exports = roleHarvester;