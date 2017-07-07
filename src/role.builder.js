import upgrader from 'role.upgrader'
import findClosestTarget from 'util.find-closest-target'

const Traits = {
  role: 'builder',
  action: 'harvesting',
  parts: [MOVE, CARRY, CARRY, WORK, WORK]
}

const ACTIONS = [
  'harvesting',
  'building'
]

const builder = {
  run: creep => {
    if (!_.includes(ACTIONS, creep.memory.action)) {
      creep.memory.action = 'harvesting'
    }

    if (creep.memory.action === 'harvesting' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'building'
      creep.memory.target = findClosestTarget(creep, 'constructionSite')
      creep.say('⚡ build')
    }

    if (creep.memory.action === 'building' && creep.carry.energy === 0) {
      creep.memory.action = 'harvesting'
      creep.say('🔄 harvest')
    }

    if (creep.memory.action === 'building') {
      const target = creep.memory.target
        ? Game.getObjectById(creep.memory.target.id)
        : findClosestTarget(creep, 'constructionSite')

      target
        ? creep.build(target) === ERR_NOT_IN_RANGE &&
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}}) === ERR_NO_PATH &&
        console.log('No path for', creep.name)
        : upgrader.run(creep)
    } else {
      const source = _.sample(creep.room.find(FIND_DROPPED_RESOURCES))

      creep.pickup(source) === ERR_NOT_IN_RANGE &&
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}}) === ERR_NO_PATH &&
        console.log('No path for', creep.name)
    }
  }
}

export default builder
export {Traits}
