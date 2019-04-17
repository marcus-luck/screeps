
var roomControl = {

    /** @param {Room} room **/
    run: function(room) {
        // console.log('room: '+ room)
        var creeps = _.filter(Game.creeps, (creep) => creep.room.name == room.name)
        

        var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester')
        var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader')
        var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder')
        var repairs = _.filter(creeps, (creep) => creep.memory.role == 'repair')

        if(harvesters.length < 6) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'harvester', working: false, targetId: null, sourceId: null}});        
        }
        else{
            if(Game.spawns['Spawn1'].energy && upgraders.length < 8) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'upgrader', working: false, targetId: null, sourceId: null}});        
            }
            
            if(Game.spawns['Spawn1'].energy && builders.length < 2 ||
            Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length > 4 && builders.length < 6) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'builder', working: false, targetId: null, sourceId: null}});        
            }

            if(Game.spawns['Spawn1'].energy && repairs.length < 2) {
                var newName = 'Repair' + Game.time;
                console.log('Spawning new repair: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'repair', working: false, targetId: null, sourceId: null}});        
            }
        }

        // Print some useless text that spawning is in progress
        var roomSpawn = room.find(FIND_MY_SPAWNS)[0];
        if(roomSpawn.spawning) {
            var spawningCreep = Game.creeps[roomSpawn.spawning.name];
            roomSpawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                roomSpawn.pos.x + 1, 
                roomSpawn.pos.y, 
                {align: 'left', opacity: 0.8});
        }

        // #### Roadbuidling logic #########
        // move to harvesters and upgraders.
        var sources = roomSpawn.room.find(FIND_SOURCES);
        sources.push.apply(sources, _.filter(roomSpawn.room.find(FIND_STRUCTURES), (s) => {
                            return (s.structureType == STRUCTURE_CONTROLLER ||
                                    s.structureType == STRUCTURE_STORAGE ||
                                    s.structureType == STRUCTURE_TOWER ||
                                    s.structureType == STRUCTURE_CONTAINER)
                                }
                            )
                        );
        
        var source = sources[Game.time % sources.length]
        var roadTo = roomSpawn.pos.findPathTo(source.pos);
        for (var i = 0; i < roadTo.length-1; i++)
        {
            roomSpawn.room.createConstructionSite(roadTo[i].x,roadTo[i].y, STRUCTURE_ROAD);
        }



    }
}

module.exports = roomControl;