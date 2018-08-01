import findClosestTarget from 'util.find-closest-target'

const Traits = {
  role: 'upgrader',
  action: 'harvesting',
  parts: [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const ACTIONS = [
  'harvesting',
  'upgrading'
]

const upgrader = {
  run: creep => {
    if (!_.includes(ACTIONS, creep.memory.action)) {
      creep.memory.action = 'harvesting'
    }

    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'upgrading'
      creep.say('⚡ upgrade')
    }

    if (creep.memory.action === 'upgrading' && creep.carry.energy === 0) {
      creep.memory.action = 'harvesting'
      creep.say('🔄 harvest')
    }

    if (creep.memory.action === 'upgrading') {
      creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
      creep.upgradeController(creep.room.controller)
    } else {
      const target = findClosestTarget(creep, 'structures', {
        filter: structure =>
          STRUCTURE_CONTAINER === structure.structureType &&
            structure.store[RESOURCE_ENERGY] > 0
      })

      if (target) {
        creep.withdraw(target, RESOURCE_ENERGY)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
      } else {
        creep.moveTo(creep.room.find(FIND_FLAGS)[0])
      }
    }
  }
}

export default upgrader
export {Traits}
