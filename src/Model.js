// @flow
import {
  observable,
  action,
  ObservableMap,
  computed,
  toJS
} from 'mobx'
import Collection from './Collection'
import { uniqueId } from 'lodash'
import apiClient from './apiClient'
import ErrorObject from './ErrorObject'
import Base from './Base'
import type {
  OptimisticId,
  Id,
  DestroyOptions,
  SaveOptions,
  CreateOptions
} from './types'

export default class Model extends Base {
  static defaultAttributes = {}

  @observable error: ?ErrorObject = null

  attributes: ObservableMap
  commitedAttributes: ObservableMap

  optimisticId: OptimisticId = uniqueId('i_')
  collection: ?Collection<*> = null

  constructor (attributes: { [key: string]: any } = {}) {
    super()

    const mergedAttributes = {
      ...this.constructor.defaultAttributes,
      ...attributes
    }

    this.attributes = observable.shallowMap(mergedAttributes)
    this.commitedAttributes = observable.shallowMap(mergedAttributes)
  }

  /**
   * Returns a JSON representation
   * of the model
   */
  toJS () {
    return toJS(this.attributes)
  }

  /**
   * Determine what attribute do you use
   * as a primary id
   *
   * @abstract
   */
  get primaryKey (): string {
    return 'id'
  }

  /**
   * Return the base url used in
   * the `url` method
   *
   * @abstract
   */
  urlRoot () {
    return null
  }

  /**
   * Return the url for this given REST resource
   */
  url (): string {
    let urlRoot = this.urlRoot()

    if (!urlRoot && this.collection) {
      urlRoot = this.collection.url()
    }

    if (!urlRoot) {
      throw new Error('implement `urlRoot` method or `url` on the collection')
    }

    if (this.isNew) {
      return urlRoot
    } else {
      return `${urlRoot}/${this.get(this.primaryKey)}`
    }
  }

  /**
   * Wether the resource is new or not
   *
   * We determine this asking if it contains
   * the `primaryKey` attribute (set by the server).
   */
  @computed
  get isNew (): boolean {
    return !this.has(this.primaryKey)
  }

  /**
   * Get the attribute from the model.
   *
   * Since we want to be sure changes on
   * the schema don't fail silently we
   * throw an error if the field does not
   * exist.
   *
   * If you want to deal with flexible schemas
   * use `has` to check wether the field
   * exists.
   */
  get (attribute: string): any {
    if (this.has(attribute)) {
      return this.attributes.get(attribute)
    }
    throw new Error(`Attribute "${attribute}" not found`)
  }

  /**
   * Returns whether the given field exists
   * for the model.
   */
  has (attribute: string): boolean {
    return this.attributes.has(attribute)
  }

  /**
   * Get an id from the model. It will use either
   * the backend assigned one or the client.
   */
  get id (): Id {
    return this.has(this.primaryKey)
      ? this.get(this.primaryKey)
      : this.optimisticId
  }

  getChangedAttributesAgainst(attributes): Array<string> {
    const changed = []

    this.commitedAttributes.keys().forEach(key => {
      if (this.commitedAttributes.get(key) !== attributes.get(key)) {
        changed.push(key)
      }
    })

    return changed
  }

  getChangesAgainst(attributes): { [string]: mixed } {
    const changes = {}

    this.getChangedAttributesAgainst(attributes).forEach(key => {
      changes[key] = attributes.get(key)
    })

    return changes
  }

  /**
   * Get an array with the attributes names that have changed.
   */
  @computed
  get changedAttributes (): Array<string> {
    return this.getChangedAttributesAgainst(this.attributes)
  }

  /**
   * Gets the current changes.
   */
  @computed
  get changes (): { [string]: mixed } {
    return this.getChangesAgainst(this.attributes)
  }

  /**
   * If an attribute is specified, returns true if it has changes.
   * If no attribute is specified, returns true if any attribute has changes.
   */
  hasChanges (attribute?: string): boolean {
    if (attribute) {
      return this.changedAttributes.indexOf(attribute) !== -1
    }

    return this.changedAttributes.length > 0
  }

  @action
  commitChanges (): void {
    this.commitedAttributes.replace(this.attributes)
  }

  @action
  discardChanges(): void {
    this.attributes.replace(this.commitedAttributes)
  }

  /**
   * Replace all attributes with new data
   */
  @action
  reset (data?: {}): void {
    this.attributes.replace(
      data
        ? { ...this.constructor.defaultAttributes, ...data }
        : this.commitedAttributes
    )
  }

  @action
  clear (): void {
    this.attributes.replace(this.constructor.defaultAttributes)
  }

  /**
   * Merge the given attributes with
   * the current ones
   */
  @action
  set (data: {}): void {
    this.attributes.merge(data)
  }

  /**
   * Fetches the model from the backend.
   */
  @action
  fetch (options: { data?: {} } = {}): Promise<*> {
    const { abort, promise } = apiClient().get(this.url(), options)

    return this.withRequest('fetching', promise, abort)
      .then(data => {
        this.reset(data)
        return data
      })
  }

  /**
   * Saves the resource on the backend.
   *
   * If the item has a `primaryKey` it updates it,
   * otherwise it creates the new resource.
   *
   * It supports optimistic and patch updates.
   *
   * TODO: Add progress
   */
  @action
  save (
    attributes: {},
    { optimistic = true, patch = false }: SaveOptions = {}
  ): Promise<*> {
    const currentAttributes = this.toJS()
    const mergedAttributes = { ...currentAttributes, ...attributes }
    const label = this.isNew ? 'creating' : 'updating'
    const data = (!this.isNew && patch)
      ? this.getChangesAgainst(observable.map(mergedAttributes))
      : mergedAttributes

    let method

    if (this.isNew) {
      method = 'post'
    } else if (patch) {
      method = 'patch'
    } else {
      method = 'put'
    }

    if (optimistic) {
      this.set(attributes)
    }

    const { promise, abort } = apiClient()[method](this.url(), { data })

    return this.withRequest(['saving', label], promise, abort)
      .then(data => {
        this.set(data)
        return data
      })
      .catch(error => {
        this.set(currentAttributes)
        throw error
      })
  }

  /**
   * Destroys the resurce on the client and
   * requests the backend to delete it there
   * too
   */
  @action
  destroy ({ optimistic = true }: DestroyOptions = {}): Promise<*> {
    const collection = this.collection

    if (this.isNew && collection) {
      collection.remove([this.id])
      return Promise.resolve()
    }

    if (this.isNew) {
      return Promise.resolve()
    }

    const { promise, abort } = apiClient().del(this.url())

    if (optimistic && collection) {
      collection.remove([this.id])
    }

    return this.withRequest('destroying', promise, abort)
      .then(data => {
        if (!optimistic && collection) {
          collection.remove([this.id])
        }
        return data
      })
      .catch(error => {
        if (optimistic && collection) {
          collection.add([this.toJS()])
        }
        throw error
      })
  }
}
