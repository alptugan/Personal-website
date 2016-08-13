function Namespace(namespace)
{
    var parts = namespace.split(".");
    var root = window;
    for(var i = 0; i < parts.length; i++)
    {
        if(typeof root[parts[i]] == "undefined")
        {
            root[parts[i]] = {};
        }
        root = root[parts[i]];
    }
}
