// @flow
import { observable } from 'mobx'
import type { RequestOptions, RequestState } from './types'

export default class Request {
  labels: Array<string>
  abort: ?() => void
  @observable progress: ?number
  @observable state: RequestState

  constructor (promise: Promise<*>, { labels, abort, progress = 0 }: RequestOptions = {}) {
    this.promise = promise
    this.state = 'pending'
    this.labels = labels
    this.abort = abort
    this.progress = progress

    promise
      .then(() => { this.state = 'fulfilled' })
      .catch(() => { this.state = 'rejected' })
  }

  then () {
    return this.promise.then.apply(this.promise, arguments)
  }

  catch () {
    return this.promise.catch.apply(this.promise, arguments)
  }
}
