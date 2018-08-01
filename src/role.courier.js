import findClosestTarget from 'util.find-closest-target'

const NUM_PER_MINER = 1
const ACTIONS = ['harvest', 'deposit']
const TRAITS = {
  role: 'courier',
  action: 'harvest',
  parts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const findAssignedMiner = creep =>
  _.find(Game.creeps, ({memory: {role, couriers}}) =>
    role === 'miner' && _.includes(couriers, creep.name))

const findFreeMiner = () =>
  _.find(Game.creeps, ({memory: {role, couriers}}) =>
    role === 'miner' && couriers.length < NUM_PER_MINER)

const Courier = {
  numPerMiner: NUM_PER_MINER,
  actions: ACTIONS,
  traits: TRAITS,
  run: creep => {
    !_.includes(ACTIONS, creep.memory.action) &&
      (creep.memory.action = 'harvest')

    if (creep.memory.action === 'harvest' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.action = 'deposit'
      creep.say(`⚡ ${creep.memory.action}`)
    }

    if (creep.memory.action === 'deposit' && creep.carry.energy === 0) {
      creep.memory.action = 'harvest'
      creep.say(`🔄 ${creep.memory.action}`)
    }

    if (creep.memory.action === 'harvest') {
      const miner = findAssignedMiner(creep) || findFreeMiner()

      if (miner) {
        !_.includes(miner.memory.couriers, creep.name) &&
          miner.memory.couriers.push(creep.name) &&
          console.log('Assigned', creep.name, 'to', miner.name)

        const target = miner.pos.findInRange(FIND_DROPPED_RESOURCES, 1)[0]

        creep.moveTo(miner, {visualizePathStyle: {stroke: '#00D084'}})

        target
          ? target.resourceType === RESOURCE_ENERGY &&
            creep.pickup(target)
          : console.log('No dropped resources for courier', creep.name)
      } else {
        creep.moveTo(creep.room.find(FIND_FLAGS)[0])
        console.log('No miner slot for courier', creep.name, '; spawn more miners.')
      }
    } else {
      const target = findClosestTarget(creep, 'structures', {
        filter: structure => STRUCTURE_CONTAINER === structure.structureType &&
          structure.store[RESOURCE_ENERGY] < structure.storeCapacity
      })

      target
        ? creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE &&
          creep.moveTo(target, {visualizePathStyle: {stroke: '#00D084'}}) === ERR_NO_PATH &&
          console.log('No path for', creep.name)
        : creep.moveTo(creep.room.find(FIND_FLAGS)[0]) &&
          console.log('No storage space available for courier', creep.name)
    }
  }
}

export default Courier
