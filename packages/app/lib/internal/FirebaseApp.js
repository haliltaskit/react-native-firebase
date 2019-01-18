import { NativeModules } from 'react-native';

import { isObject } from '@react-native-firebase/common';

export default class FirebaseApp {
  constructor(name, options = {}, fromNative = false, deleteApp) {
    this._name = name;
    this._deleted = false;
    this._options = Object.assign({}, options);
    this._deleteApp = deleteApp;
    if (fromNative) {
      this._initialized = true;
      this._nativeInitialized = true;
    }
  }

  /**
   *
   * @return {*}
   */
  get name() {
    return this._name;
  }

  /**
   *
   * @return {*}
   */
  get options() {
    return Object.assign({}, this._options);
  }

  extendApp(extendedProps = {}) {
    // TODO
  }

  /**
   *
   * @return {Promise}
   */
  delete() {
    if (this._name === APPS.DEFAULT_APP_NAME && this._nativeInitialized) {
      return Promise.reject(
        new Error('Unable to delete the default native firebase app instance.'),
      );
    }

    return FirebaseCoreModule.deleteApp(this.name).then(() => this._deleteApp(this.name));
  }

  /**
   *
   * @return {*}
   */
  onReady() {
    if (this._initialized) return Promise.resolve(this);

    return new Promise((resolve, reject) => {
      SharedEventEmitter.once(`AppReady:${this._name}`, ({ error }) => {
        if (error) return reject(new Error(error)); // error is a string as it's from native
        return resolve(this); // return app
      });
    });
  }

  /**
   * toString returns the name of the app.
   *
   * @return {string}
   */
  toString() {
    return this.name;
  }
}