const Utilities = {
  ensureAction: (creep, actions, defaultAction) =>
    !_.includes(actions, creep.memory.action) &&
      (creep.memory.action = defaultAction)
}

export default Utilities
