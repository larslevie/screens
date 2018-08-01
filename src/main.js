import builder from 'role.builder'
import Courier from 'role.courier'
import Miner from 'role.miner'
import roleHarvester from 'role.harvester'
import Spawner from 'task.spawner'
import upgrader from 'role.upgrader'

module.exports.loop = function () {
  _.map(_.keys(Memory.creeps), name =>
    !Game.creeps[name] &&
      _.each(Memory.state.sources, source => _.remove(source.miners, name)) &&
      _.each(Game.creeps, creep =>
        creep.memory.role === 'miner' &&
          _.remove(creep.memory.couriers, name)
      ) &&
      delete Memory.creeps[name] &&
      console.log('Clearing non-existing creep memory:', name))

  _.each(Game.rooms, room => {
    const sources = room.find(FIND_SOURCES)
    Memory.state.sources = {}

    _.each(sources, ({id}) => (Memory.state.sources[id] = {id: id, miners: []}) && true)

    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: structure => STRUCTURE_TOWER === structure.structureType
    })

    _.each(towers, tower => {
      const hostile = room.find(FIND_HOSTILE_CREEPS)[0]
      hostile && tower.attack(hostile)

      const damaged = room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax / 4
      })[0]

      damaged && tower.repair(damaged)
    })
  })

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]

    console.log('Spawning', spawningCreep.memory.role)

    Game.spawns['Spawn1'].room.visual.text(
      '🛠️ ' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x - 1,
      Game.spawns['Spawn1'].pos.y,
      {align: 'right', opacity: 0.8})
  } else {
    Spawner.run()
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name]

    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep)
    }

    if (creep.memory.role === 'upgrader') {
      upgrader.run(creep)
    }

    if (creep.memory.role === 'builder') {
      builder.run(creep)
    }

    if (creep.memory.role === 'miner') {
      Miner.run(creep)
    }

    if (creep.memory.role === 'courier') {
      Courier.run(creep)
    }
  }
}
