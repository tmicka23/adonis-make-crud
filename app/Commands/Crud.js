"use strict";

const { Command } = require("@adonisjs/ace");
const { modelTemplate } = require("../../templates/models.js");
const { webController } = require("../../templates/webController.js");

class Crud extends Command {
  static get signature() {
    return `
    make:crud 
    {model: The name of the resource you want to create}
    {--api: By default adonis make:crud generate a fullstack CRUD resource, if you want to serve them as an api resource, add --api flag}
    `;
  }

  static get description() {
    return "Make a new HTTP resource with CRUD operations available";
  }

  async handle(args, options) {
    this.info(`you want to create a ${args.model} resource`);

    let again = true;

    const columns = [];

    do {
      const column = await this.ask(
        `Enter a name of a column for the model ${args.model}`
      );

      const type = await this.choice(
        `Enter the type for the column ${column}`,
        [
          {
            name: "string",
            value: "String",
          },
          {
            name: "text",
            value: "Text",
          },
          {
            name: "integer",
            value: "Integer",
          },
          {
            name: "float",
            value: "Float",
          },
          {
            name: "boolean",
            value: "Boolean",
          },
          {
            name: "datetime",
            value: "Datetime",
          },
          {
            name: "references",
            value: "References",
          },
        ],
        "String"
      );

      const nullable = await this.confirm(`${column} can be nullable ?`);

      again = await this.confirm("do you want to add a column ?");

      columns.push({
        column,
        type,
        nullable,
      });
    } while (again);

    console.log(columns);
    const modelCreated = await this.addModel(args.model);
    const controllerCreated = await this.addController(args.model, columns);
    if (modelCreated)
      this.success(
        `${this.icon("success")} A model ${args.model}, has been created`
      );
    if (controllerCreated)
      this.success(
        `${this.icon("success")} A web controller ${
          args.model
        }Controller, has been created`
      );
  }

  async addModel(name) {
    try {
      await this.generateFile(`app/Models/${name}.js`, modelTemplate, { name });

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      console.error(error);
    }
  }

  async addController(name, columns) {
    try {
      const lowerCasedName = name.slice().toLowerCase();
      const pluralizedName = lowerCasedName.slice() + "s";
      const requiredColumns = columns.filter((c) => !c.nullable);
      await this.generateFile(
        `app/Controllers/http/web/${name}Controller.js`,
        webController,
        { name, lowerCasedName, pluralizedName, requiredColumns, columns }
      );

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      console.error(error);
    }
  }

  // async addRoutes(name) {
  //   try {
  //     await this.generateFile(`app/Models/${name}.js`, webController, { name });

  //     return new Promise((resolve) => resolve(true));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}

module.exports = Crud;
