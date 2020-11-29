module.exports = {
  modelTemplate: `'use strict'

  /** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
  const Model = use('Model')
  
  class {{name}} extends Model {
    static boot () {
      super.boot()
    }
  
  }
  
  module.exports = {{name}};`,
};
