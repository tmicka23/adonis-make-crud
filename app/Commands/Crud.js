"use strict";

const fs = require("fs");
const { Command } = require("@adonisjs/ace");
const { modelTemplate } = require("../../templates/models.js");
const { webController } = require("../../templates/webController.js");
const { migration } = require("../../templates/migration.js");
const { index, show, create, edit } = require("../../templates/views.js");

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
    try {
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

      const modelCreated = await this.addModel(args.model);
      const controllerCreated = await this.addController(args.model, columns);
      const routesCreated = await this.addRoutes(args.model);
      const migrationCreated = await this.addMigration(args.model, columns);
      const viewsCreated = await this.addViews(args.model, columns);

      if (modelCreated) {
        this.success(
          `${this.icon("success")} Create app/Models/${args.model}.js`
        );
      }
      if (controllerCreated) {
        this.success(
          `${this.icon("success")} Create app/Controllers/Http/${
            args.model
          }Controller.js`
        );
      }

      if (routesCreated) {
        this.success(`${this.icon("success")} Update start/routes.js`);
      }

      if (migrationCreated) {
        this.success(
          `${this.icon("success")} Create database/migrations/${
            migrationCreated.fileName
          }`
        );
      }

      if (viewsCreated) {
        this.success(
          `${this.icon(
            "success"
          )} Create resources/views/${args.model.toLowerCase()}s/index.edge`
        );
        this.success(
          `${this.icon(
            "success"
          )} Create resources/views/${args.model.toLowerCase()}s/create.edge`
        );
        this.success(
          `${this.icon(
            "success"
          )} Create resources/views/${args.model.toLowerCase()}s/show.edge`
        );
        this.success(
          `${this.icon(
            "success"
          )} Create resources/views/${args.model.toLowerCase()}s/edit.edge`
        );
      }

      if (
        modelCreated &&
        controllerCreated &&
        routesCreated &&
        migrationCreated &&
        viewsCreated
      ) {
        console.log(
          this.chalk.cyan(
            "#######################################################"
          )
        );
        this.success(
          `${this.icon("success")} CRUD resource ${
            args.model
          } has been created successfully`
        );

        this.info(`${this.icon("info")} now run 'adonis migration:run'`);

        this.info(
          `${this.icon(
            "info"
          )} you can see that resource at 'http://localhost:3333/${args.model.toLowerCase()}s`
        );
      }
    } catch (error) {
      this.failed(
        this.chalk.red(` ${this.icon("error")} adonis make:crud`),
        this.chalk.bgRed(this.chalk.white(" Command failed"))
      );
      this.failed(
        this.chalk.red("-> "),
        this.chalk.bgRed(this.chalk.white(error))
      );
    }
  }

  async addModel(name) {
    try {
      await this.generateFile(`app/Models/${name}.js`, modelTemplate, { name });

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      throw error;
    }
  }

  async addController(name, columns) {
    try {
      const lowerCasedName = name.slice().toLowerCase();
      const pluralizedName = lowerCasedName.slice() + "s";
      const requiredColumns = columns.filter((c) => !c.nullable);
      await this.generateFile(
        `app/Controllers/Http/${name}Controller.js`,
        webController,
        { name, lowerCasedName, pluralizedName, requiredColumns, columns }
      );

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      throw error;
    }
  }

  async addRoutes(name) {
    try {
      const lowerCasedName = name.slice().toLowerCase();
      const pluralizedName = lowerCasedName.slice() + "s";
      fs.appendFile(
        "start/routes.js",
        `\n Route.resource('${pluralizedName}', '${name}Controller');
        `,
        function (err) {
          if (err) throw err;
        }
      );

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      throw error;
    }
  }

  async addMigration(name, columns) {
    try {
      const lowerCasedName = name.slice().toLowerCase();
      const pluralizedName = lowerCasedName.slice() + "s";
      const timestamp = Date.now();
      columns = columns.map((c) => ({
        ...c,
        type: c.type.toLowerCase(),
        nullable: c.nullable ? "nullable" : "notNullable",
      }));
      await this.generateFile(
        `database/migrations/${timestamp}_${name}sSchema.js`,
        migration,
        { name, lowerCasedName, pluralizedName, columns }
      );

      return new Promise((resolve) =>
        resolve({ fileName: `${timestamp}_${name}sSchema.js` })
      );
    } catch (error) {
      throw error;
    }
  }

  async addViews(name, columns) {
    try {
      const lowerCasedName = name.slice().toLowerCase();
      const pluralizedName = lowerCasedName.slice() + "s";

      await this.generateFile(
        `resources/views/${pluralizedName}/index.edge`,
        index,
        { name, lowerCasedName, pluralizedName, columns },
        ["<%", "%>"]
      );

      await this.generateFile(
        `resources/views/${pluralizedName}/show.edge`,
        show,
        { name, lowerCasedName, pluralizedName, columns },
        ["<%", "%>"]
      );

      await this.generateFile(
        `resources/views/${pluralizedName}/create.edge`,
        create,
        { name, lowerCasedName, pluralizedName, columns },
        ["$=", "=$"]
      );

      await this.generateFile(
        `resources/views/${pluralizedName}/edit.edge`,
        edit,
        { name, lowerCasedName, pluralizedName, columns },
        ["$=", "=$"]
      );

      return new Promise((resolve) => resolve(true));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Crud;
