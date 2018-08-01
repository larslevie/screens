const Traits = {
  role: 'miner',
  action: 'mining',
  parts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const findAssignedSource = creep =>
  _.find(Memory.state.sources, ({miners}) => _.includes(miners, creep.name))

const findFreeSource = () =>
  _.find(Memory.state.sources, ({miners}) => miners.length < 1)

const Miner = {
  run: creep => {
    const sourceState = findAssignedSource(creep) || findFreeSource() || Memory.state.sources[_.keys(Memory.state.sources)[0]]

    !_.includes(sourceState.miners, creep.name) &&
      sourceState.miners.push(creep.name)

    const source = Game.getObjectById(sourceState.id)
    const target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 0)[0]

    creep.pickup(target)
    creep.harvest(source) === ERR_NOT_IN_RANGE &&
      creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})

    _.each(creep.memory.couriers, name => {
      const courier = Game.creeps[name]

      courier && creep.transfer(courier, RESOURCE_ENERGY)
    })
  }
}

export default Miner
export {Traits}
