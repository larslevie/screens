import {Traits as BuilderTraits} from 'role.builder'
import {Traits as MinerTraits} from 'role.miner'
import {Traits as UpgraderTraits} from 'role.upgrader'
import Courier from 'role.courier'
import Harvester from 'role.harvester'

const Spawner = {
  run: () => {
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester')
    if (harvesters.length < 2) {
      const newName = Game.spawns['Spawn1'].createCreep(Harvester.traits.parts, undefined, {role: Harvester.traits.role})
      console.log('Spawning new harvester: ' + newName)
    } else {
      const miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner')
      if ((miners.length <= _.keys(Memory.state.sources).length || _.all(miners, miner => miner.ticksToLive < 1000)) && miners.length <= 3) {
        const newName = Game.spawns['Spawn1'].createCreep(MinerTraits.parts, undefined, {role: MinerTraits.role, couriers: []})
        console.log('Spawning new miner: ' + newName)
      } else {
        const couriers = _.filter(Game.creeps, (creep) => creep.memory.role === 'courier')
        if (miners && couriers.length < Courier.numPerMiner * miners.length) {
          console.log(Courier.traits)
          const newName = Game.spawns['Spawn1'].createCreep(Courier.traits.parts, undefined, {role: Courier.traits.role})
          console.log('Spawning new courier: ' + newName)
        } else {
          const upgraders = _.filter(Game.creeps, ({memory: {role}}) => role === 'upgrader')
          if (upgraders.length < 1) {
            const newName = Game.spawns['Spawn1'].createCreep(UpgraderTraits.parts, undefined, {role: 'upgrader'})
            console.log('Spawning new upgrader: ' + newName)
          } else {
            const builders = _.filter(Game.creeps, ({memory: {role}}) => role === 'builder')
            if (builders.length < 2) {
              const newName = Game.spawns['Spawn1'].createCreep(BuilderTraits.parts, undefined, {role: 'builder'})
              console.log('Spawning new builder: ' + newName)
            }
          }
        }
      }
    }
  }
}

export default Spawner
