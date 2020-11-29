module.exports = {
  migration: `'use strict'

    const Schema = use('Schema')
    
    class {{name}}sSchema extends Schema {
      up () {
        this.create('{{pluralizedName}}', (table) => {
          table.increments()
          {{#columns}}
            table.{{type}}('{{column}}').{{nullable}}()
          {{/columns}}
          table.timestamps()
        })
      }
    
      down () {
        this.drop('{{pluralizedName}}')
      }
    }
    
    module.exports = {{name}}sSchema`,
};
