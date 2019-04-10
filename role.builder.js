var roleBuilder = {

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

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                for(var target in targets) {
                    var t = targets[target]
                    console.log("Target: " + t)
                    if(creep.build(t) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(t) //, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]) //, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;