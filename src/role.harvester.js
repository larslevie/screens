import builder from 'role.builder'
import findClosestTarget from 'util.find-closest-target'

const Traits = {
  role: 'upgrader',
  action: 'harvesting',
  parts: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const ELIGIBLE_TARGETS = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_STORAGE
]

const ACTIONS = [
  'collecting',
  'filling'
]

const ensureAction = (creep) =>
  !_.includes(ACTIONS, creep.memory.action) &&
    (creep.memory.action = 'collecting')

const roleHarvester = {
  run: creep => {
    ensureAction(creep, 'collecting')

    if (creep.memory.action === 'collecting' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'filling'
      creep.say('⚡ build')
    }

    if (creep.memory.action === 'filling' && creep.carry.energy === 0) {
      creep.memory.action = 'collecting'
      creep.say('🔄 filling')
    }

    if (creep.memory.action === 'filling') {
      const target = findClosestTarget(creep, 'structures', {
        filter: structure =>
          _.includes(ELIGIBLE_TARGETS, structure.structureType) &&
            structure.energy < structure.energyCapacity
      })

      target
        ? creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE &&
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}}) === ERR_NO_PATH &&
          console.log('No path for', creep.name)
        : builder.run(creep)
    } else {
      const source = findClosestTarget(creep, 'droppedResources')

      creep.pickup(source) === ERR_NOT_IN_RANGE &&
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}}) === ERR_NO_PATH &&
        console.log('No path for', creep.name)
    }
  }
}

export default roleHarvester
export {Traits}
