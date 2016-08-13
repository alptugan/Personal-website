Namespace("nl.stroep.utils");
nl.stroep.utils.Color = function( color )
{
    /* PUBLIC FUNCTIONS */

    this.grayscale = function( val )
    {
        val = val || 0;
        if (val < 0){ val = 0; }
        if (val > 255) { val = 255; }

        return (val << 16) | (val << 8 ) | val;
    }

    /* PRIVATE FUNCTIONS */
    function limit( val, lowerLimit, upperLimit )
    {
        if (val < lowerLimit){ return lowerLimit; }
        if (val > upperLimit) { return upperLimit; }
        return val;
    }

    /* PUBLIC GETTER FUNCTIONS */

    this.__defineGetter__("value", function()
    {
        return (_red << 16) | (_green << 8 ) | _blue;
    });

    this.__defineGetter__("red", function()
    {
        return _red;
    })

    this.__defineGetter__("green", function()
    {
        return _green;
    })

    this.__defineGetter__("blue", function()
    {
        return _blue;
    })

    /* PUBLIC SETTER FUNCTIONS */

    this.__defineSetter__("value", function(val)
    {
        _red  = val >> 16 & 0xFF; // red
        _green  = val  >> 8 & 0xFF; // green
        _blue = val & 0xFF; // blue

        _value = val;
    })

    this.__defineSetter__("red", function(val)
    {
        _red = val;
        _red = limit( _red, 0, 255 );
    })

    this.__defineSetter__("green", function(val)
    {
        _green = val;
        _green = limit( _green, 0, 255 );
    })

    this.__defineSetter__("blue", function(val)
    {
        _blue = val;
        _blue = limit( _blue, 0, 255 );
    })

    /* PRIVATE VARIABLES */
    var _value = color;
    var _red;
    var _green;
    var _blue;

    /* PUBLIC VARIABLES */
    this.value = _value;

};
