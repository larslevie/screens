import upgrader from 'role.upgrader'
import findClosestTarget from 'util.find-closest-target'

const Traits = {
  role: 'builder',
  action: 'harvesting',
  parts: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
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

      if (target) {
        creep.build(target)
        creep.repair(target)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#f44336'}})
      } else {
        upgrader.run(creep)
      }
    } else {
      let target = findClosestTarget(creep, 'structures', {
        filter: structure =>
          STRUCTURE_CONTAINER === structure.structureType &&
            structure.store[RESOURCE_ENERGY] > 0
      })

      if (target) {
        creep.withdraw(target, RESOURCE_ENERGY)
      } else {
        target = findClosestTarget(creep, 'sources')
        creep.harvest(target, RESOURCE_ENERGY)
      }

      creep.moveTo(target, {visualizePathStyle: {stroke: '#f44336'}})
    }
  }
}

export default builder
export {Traits}
