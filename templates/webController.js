module.exports = {
  webController: `'use strict'

    //bringing in model
    const {{name}} = use('App/Models/{{name}}')
    //bringing in Validator
    const { validate } = use('Validator')
    
    class {{name}}Controller {
        // index method (async)
        async index({ view }) {
            //getting all {{pluralizedName}}
            const {{pluralizedName}} = await {{name}}.all()
    
            //used redirecting to a page, {{pluralizedName}}.index is same as {{pluralizedName}}/index
            return view.render('{{pluralizedName}}.index', {
                title: "Index Page Params",
                {{pluralizedName}}: {{pluralizedName}}.toJSON()
            })   
        }
        //method used for showing {{lowerCasedName}} based on id
        async show({ params, view }) {
            const {{lowerCasedName}} = await {{name}}.find(params.id)
            //redirecting to the details page
            return view.render('{{pluralizedName}}.show', {
                {{lowerCasedName}}
            })
        }
    
        //method used for adding {{lowerCasedName}} into database
        async create({ view }) {
            //redirect to the add page
            return view.render('{{pluralizedName}}.create')
        }
    
        async store({ request, response, session }) {
            //Validating inputs
            const validation = await validate(request.all(), {
                {{#requiredColumns}}
                    {{column}}: 'required',
                {{/requiredColumns}}
            });
    
            if(validation.fails()){
                session.withErrors(validation.messages()).flashAll()
                return response.redirect('back')
            }
            //creating {{lowerCasedName}} instance
            const {{lowerCasedName}} = new {{name}}()
            //accepting inputs
            {{#columns}}
                {{lowerCasedName}}.{{column}} = request.input('{{column}}')
            {{/columns}}
            //saving inputs
            await {{lowerCasedName}}.save()
            //flash message after submission
            session.flash({ notification: '{{name}} Added'})
            //redirect to {{lowerCasedName}} page
            return response.redirect('/{{pluralizedName}}')
        }
    
        //showing {{lowerCasedName}} from database into input field
        async edit({ params, view }) {
            //fetching from the database
            const {{lowerCasedName}} = await {{name}}.find(params.id)
            //redirect to the edit page
            return view.render('{{pluralizedName}}.edit', {
                {{lowerCasedName}}
            })
        }
    
        //updating {{lowerCasedName}}
        async update({ params, request, response, session }) {
            //Validating inputs
            const validation = await validate(request.all(), {
                {{#requiredColumns}}
                    {{column}}: 'required',
                {{/requiredColumns}}
            });
    
            if(validation.fails()){
                session.withErrors(validation.messages()).flashAll()
                return response.redirect('back')
            }
    
            const {{lowerCasedName}} =  await {{name}}.find(params.id)
    
            {{#columns}}
                {{lowerCasedName}}.{{column}} = request.input('{{column}}')
            {{/columns}}
            //saving inputs
            await {{lowerCasedName}}.save()
            //flash message after submission
            session.flash({ notification: '{{name}} Updated'})
            //redirect to {{lowerCasedName}} page
            return response.redirect('/{{pluralizedName}}')
        }
    
        async destroy({ params, session, response }) {
            const {{lowerCasedName}} = await {{name}}.find(params.id)
            //saving inputs
            await {{lowerCasedName}}.delete()
            //flash message after submission
            session.flash({ notification: '{{name}} Delete'})
            //redirect to {{lowerCasedName}} page
            return response.redirect('/{{pluralizedName}}')
        }
    }
    
    module.exports = {{name}}Controller`,
};
