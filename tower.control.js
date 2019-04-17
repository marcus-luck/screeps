
var towerControl = {

    /** @param {StructureTower} tower **/
    run: function(tower) {
        // console.log("tower: "+tower);
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
            filter: (structure) => { 
                return (structure.hits < structure.hitsMax && structure.hits > 0 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
            }});
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);

        }
    }
}

module.exports = towerControl;
