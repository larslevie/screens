import builder from 'role.builder'
import findClosestTarget from 'util.find-closest-target'

const ELIGIBLE_TARGETS = [
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN
]

const ACTIONS = [
  'collecting',
  'refilling'
]

const ensureAction = (creep) =>
  !_.includes(ACTIONS, creep.memory.action) &&
    (creep.memory.action = 'collecting')

const isCarryFull = creep => creep.carry.energy === creep.carryCapacity
const isAction = ({memory: {action}}, testAction) => action === testAction

const roleHarvester = {
  run: function (creep) {
    ensureAction(creep, 'collecting')

    if (isAction(creep, 'collecting') && isCarryFull(creep)) {
      creep.memory.action = 'refilling'
      creep.memory.target = findClosestTarget(creep, 'structures', {
        filter: structure =>
          _.includes(ELIGIBLE_TARGETS, structure.structureType) &&
            structure.energy < structure.energyCapacity
      })
    }

    // if (creep.carry.energy < creep.carryCapacity) {
    //   const source = findClosestTarget(creep, 'droppedResources')
    //
    //   creep.pickup(source) === ERR_NOT_IN_RANGE &&
    //     creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
    // } else {
    //   const targets = creep.room.find(FIND_STRUCTURES, {
    //     filter: structure =>
    //       _.includes(ELIGIBLE_TARGETS, structure.structureType) &&
    //         structure.energy < structure.energyCapacity
    //   })
    //
    //   if (targets.length > 0) {
    //     if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //       creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
    //     }
    //   } else {
    //     builder.run(creep)
    //   }
    // }
  }
}

export default roleHarvester
