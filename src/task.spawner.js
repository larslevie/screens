import {Traits as MinerTraits} from 'role.miner'
import {Traits as BuilderTraits} from 'role.builder'
import {Traits as UpgraderTraits} from 'role.upgrader'

const Spawner = {
  run: () => {
    if (Game.spawns.Spawn1.spawning) { return };

    const miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner')
    if (miners.length < 2) {
      var newName = Game.spawns['Spawn1'].createCreep(MinerTraits.parts, undefined, {role: MinerTraits.role})
      console.log('Spawning new miner: ' + newName)
    }

    const builders = _.filter(Game.creeps, ({memory: {role}}) => role === 'builder')
    if (builders.length < 4) {
      const newName = Game.spawns['Spawn1'].createCreep(BuilderTraits.parts, undefined, {role: BuilderTraits.role})
      console.log('Spawning new builder: ' + newName)
    }

    const upgraders = _.filter(Game.creeps, ({memory: {role}}) => role === 'upgrader')
    if (upgraders.length < 3) {
      const newName = Game.spawns['Spawn1'].createCreep(UpgraderTraits.parts, undefined, {role: UpgraderTraits.role})
      console.log('Spawning new upgrader: ' + newName)
    }
  }
}

export default Spawner
