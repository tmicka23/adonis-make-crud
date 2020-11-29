module.exports = {
  index: `@layout('layout')
    @section('content')
        <h2><% name %>s</h2>
        @if(old('notification'))
            <div class="alert alert-success">
                {{ old('notification') }}
            </div>
        @endif
        <ul class="list-group">
            @each(<%lowerCasedName%> in <%pluralizedName%>)
                <li class="list-group-item"><a href="/<%pluralizedName%>/{{ <%lowerCasedName%>.id }}">Show</a></li>
            @endeach
        </ul>
        <a href="/<%pluralizedName%>/create">New <%lowerCasedName%></a>
    @endsection`,

  show: `@layout('layout')

    @section('content')
        <a href="/<%pluralizedName%>" class="btn btn-primary">Go Back</a>
        <hr>
        <%#columns%>
        <p>{{ <%lowerCasedName%>.<%column%> }}</p>
        <%/columns%>
        <hr>
        <a href="/<%pluralizedName%>/{{ <%lowerCasedName%>.id }}/edit" class="btn btn-dark d-block float-left">Edit</a>
        <form action="{{ '/<%pluralizedName%>/' + <%lowerCasedName%>.id + '?_method=DELETE' }}" method="POST">
            {{ csrfField() }}
        <button type="submit" class="btn btn-danger d-block float-right">Delete</buttona>
        </form>
    @endsection`,

  create: `@layout('layout')

    @section('content')
        <a href="/$=pluralizedName=$" class="btn btn-primary">Go Back</a>
        <hr>
        <h2>Create $=name=$</h2>
        <form action="/$=pluralizedName=$" method="POST">
            {{ csrfField() }}
            $=#columns=$
            <div class="form-group">
                <label>{{ $=column=$ }}</label>
                <input type="text" class="form-control" value="{{ old($=column=$, '') }}" placeholder="$=column=$" name="$=column=$">
                {{ elIf('<span class="text-danger">$self</span>', getErrorFor('$=column=$'), hasErrorFor('$=column=$')) }}
            </div>
            $=/columns=$
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    @endsection
    `,

  edit: `@layout('layout')

    @section('content')
        <a href="{{"/$=pluralizedName=$"}}" class="btn btn-primary">Go Back</a>
        <hr>
        <h2>Create $=name=$</h2>
        <form action="{{"/$=pluralizedName=$/" + $=lowerCasedName=$.id + "?_method=PUT"}}" method="POST">
            {{ csrfField() }}
            $=#columns=$
            <div class="form-group">
                <label>{{ $=column=$ }}</label>
                <input type="text" class="form-control" value="{{ $=lowerCasedName=$.$=column=$ }}" placeholder="$=column=$" name="$=column=$">
                {{ elIf('<span class="text-danger">$self</span>', getErrorFor('$=column=$'), hasErrorFor('$=column=$')) }}
            </div>
            $=/columns=$
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    @endsection`,
};
