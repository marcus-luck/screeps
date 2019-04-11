var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 NOMNOM');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ BANKA!');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller) //, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
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

module.exports = roleUpgrader;