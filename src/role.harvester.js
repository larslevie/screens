import builder from 'role.builder'
import findClosestTarget from 'util.find-closest-target'

const TRAITS = {
  role: 'harvester',
  action: 'harvesting',
  parts: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const ELIGIBLE_TARGETS = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER
]

const ACTIONS = [
  'collecting',
  'filling'
]

const ensureAction = (creep) =>
  !_.includes(ACTIONS, creep.memory.action) &&
    (creep.memory.action = 'collecting')

const roleHarvester = {
  actions: ACTIONS,
  traits: TRAITS,
  run: creep => {
    ensureAction(creep, 'collecting')

    if (creep.memory.action === 'collecting' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'filling'
      creep.say(`⚡ ${creep.memory.action}`)
    }

    if (creep.memory.action === 'filling' && creep.carry.energy === 0) {
      creep.memory.action = 'collecting'
      creep.say(`🔄 ${creep.memory.action}`)
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
      const miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner' && !creep.spawning)
      const couriers = _.filter(Game.creeps, (creep) => creep.memory.role === 'courier' && !creep.spawning)

      let target

      if (miners.length === 0) {
        target = findClosestTarget(creep, 'sources')
        target
          ? creep.harvest(target, RESOURCE_ENERGY)
          : creep.carry > 0
            ? creep.memory.action = 'filling'
            : creep.moveTo(creep.room.find(FIND_FLAGS)[0])
      } else {
        if (couriers.length === 0) {
          target = findClosestTarget(creep, 'droppedResources')
          target
            ? target.resourceType === RESOURCE_ENERGY &&
              creep.pickup(target)
            : creep.carry > 0
              ? creep.memory.action = 'filling'
              : creep.moveTo(creep.room.find(FIND_FLAGS)[0])
        } else {
          target = findClosestTarget(creep, 'structures', {
            filter: structure =>
              STRUCTURE_CONTAINER === structure.structureType &&
              structure.store[RESOURCE_ENERGY] > 0
          })
          target
            ? creep.withdraw(target, RESOURCE_ENERGY)
            : creep.carry > 0
              ? creep.memory.action = 'filling'
              : creep.moveTo(creep.room.find(FIND_FLAGS)[0])
        }
      }

      creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
    }
  }
}

export default roleHarvester
