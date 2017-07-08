const Traits = {
  role: 'courier',
  action: 'moving',
  parts: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]
}

const Miner = {
  run: creep => {
    const sources = creep.room.find(FIND_SOURCES)

    creep.harvest(sources[0]) === ERR_NOT_IN_RANGE &&
      creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}})
  }
}

export default Miner
export {Traits}
