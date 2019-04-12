var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building == true && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 Hacka!');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 Hamra');
        }

        if(creep.memory.building) {
            if(!creep.memory.targetId){
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    creep.memory.targetId = targets[0].id;
                }
            }
            else{
                var t = Game.getObjectById(creep.memory.targetId);
                if(creep.build(t) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t) //, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.build(t) == ERR_INVALID_TARGET){
                    console.log('clearing builder mem');
                    creep.memory.targetId = false;
                }
            }
        }

        // need to nom some more food
        if(!creep.memory.building){
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
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

        }


    }
};

module.exports = roleBuilder;

