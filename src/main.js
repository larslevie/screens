import builder from 'role.builder'
import roleHarvester from 'role.harvester'
import upgrader from 'role.upgrader'
import Miner from 'role.miner'

import Spawner from 'task.spawner'

module.exports.loop = function () {
  _.map(_.keys(Memory.creeps), name =>
    !Game.creeps[name] &&
      delete Memory.creeps[name] &&
      console.log('Clearing non-existing creep memory:', name))

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester')

  if (harvesters.length < 2) {
    var newName = Game.spawns['Spawn1'].createCreep([MOVE, CARRY, CARRY, WORK], undefined, {role: 'harvester'})
    console.log('Spawning new harvester: ' + newName)
  }

  if (harvesters.length >= 2) {
    Spawner.run()
  }

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]

    Game.spawns['Spawn1'].room.visual.text(
      '🛠️ ' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x - 1,
      Game.spawns['Spawn1'].pos.y,
      {align: 'right', opacity: 0.8})
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
  }
}
