const Traits = {
  role: 'upgrader',
  action: 'harvesting',
  parts: [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK]
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
      creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE &&
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}}) === ERR_NO_PATH &&
        console.log('No path for', creep.name)
    } else {
      const source = _.sample(creep.room.find(FIND_DROPPED_RESOURCES))

      creep.pickup(source) === ERR_NOT_IN_RANGE &&
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}}) === ERR_NO_PATH &&
        console.log('No path for', creep.name)
    }
  }
}

export default upgrader
export {Traits}
