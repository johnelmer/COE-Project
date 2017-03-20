function Idempotent(target, key, descriptor) {
  const getter = descriptor.get
  const previous = new Map()

  function idempotentVersion() {
    let result = getter.call(this)

    // assume that there's always an ID, since we're doing relationships
    const identifier = `${key}:${this._id}`
    const latestJson = JSON.stringify(result)
    let cachedJson = ''

    if (previous.has(identifier)) {
      cachedJson = JSON.stringify(previous.get(identifier))
    }

    if (latestJson === cachedJson) {
      result = previous.get(identifier)
    }

    previous.set(identifier, result)
    return result
  }

  descriptor.get = idempotentVersion // eslint-disable-line
}

export default Idempotent
