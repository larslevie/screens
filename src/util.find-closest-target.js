const TARGET_TYPES = {
  constructionSite: FIND_CONSTRUCTION_SITES,
  droppedResources: FIND_DROPPED_RESOURCES,
  sources: FIND_SOURCES,
  structures: FIND_STRUCTURES
}

const calcTargetCosts = ({pos}, targets) =>
  _.map(targets, (target) =>
    _.extend({}, PathFinder.search(pos, {pos: target.pos}), {target: target})
  )

const findClosestTarget = (creep, type, {filter} = {}) => {
  if (!_.includes(_.keys(TARGET_TYPES), type)) {
    console.error('Invalid target type passed to findClosestTarget function')
    return
  }

  const costedTargets = calcTargetCosts(creep, creep.room.find(TARGET_TYPES[type], {filter}))

  return _.map(_.sortBy(costedTargets, ({cost}) => cost), ({target}) => target)[0]
}

export default findClosestTarget
