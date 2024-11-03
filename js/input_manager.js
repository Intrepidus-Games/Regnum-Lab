const InputTriggerMethod = Object.freeze({
    None: 0,
    Down: 1,
    Up: 2,
    Pressed: 3
});

const InputValueType = Object.freeze({
    Bool: 0,
    Float: 1,
    Vector2: 2,
    Vector3: 3
});

/**
 * Creates a keybind class
 * 
 * @param {string} keycode - The keycode of the keybind
 * @returns {InputAction} The keybind
 */
class Keybind
{
    constructor(keycode, modifiers=[])
    {
        this.keycode = keycode;
        this.modifiers = modifiers;
    }
}

/**
 * Creates a keybind action | basically manages when and what a keybind returns
 * 
 * @param {InputMethod} inputTriggerMethod - When the action fires
 * @param {InputValueType} valueType - What returns when action fires
 * @param {array} keybinds - An array  of all the keybinds
 * @returns {InputAction} The class
 */
class InputAction
{
    constructor(
        triggerMethod=InputTriggerMethod.Up,
        valueType=InputValueType.bool,
        keybinds=[]
    )
    {
        this.triggerMethod = triggerMethod;
        this.valueType = valueType;
        this.keybinds = keybinds;
    }
}

/**
 * Create an Input Mapping
 * 
 * @param {InputAction} actions - An array of keybinds
 * @returns {InputMapping} The class
 */
class InputMapping
{
    constructor(actions=[])
    {
        this.actions = actions;
    }

    /**
     * Checks if the specified keycode is binded to any of the actions
     * @param {string} keycode -- The keybind input keycode
     * @returns {bool} returns true is keybind is added to any of the actions
     */
    hasKeybind(keycode)
    {
        let hasKeycode = false;
        this.actions.forEach((v)=>{
            v.keybinds.forEach((key)=>{
                if (key.keycode == keycode)
                {
                    
                }
            })
        })
        return hasKeycode;
    }
    manageKeybind(key, trigger)
    {

    }
}

class RegnumSceneInputManager
{
    constructor(canvas)
    {
        // private
        this.canvas = canvas;
        this.keysDown = [];

        // mappings
        this.mappings = [];

        if (this.canvas != null)
        {
            console.log("Input Manager Loaded | Canvas: " + canvas);

            this.canvas.setAttribute("tabindex", "0"); // Make the canvas focusable
            this.canvas.addEventListener("keydown", (e)=>{ this.manageInputMethod(e.key.toLowerCase(), InputMethod.Down); })
            this.canvas.addEventListener("keyup", (e)=>{ this.manageInputMethod(e.key.toLowerCase(), InputMethod.Up); })
        }
    }

    addInputMapping(inputMapping)
    {
        this.mappings.push(inputMapping);
    }

    manageKeybind(key, trigger)
    {
        //this.mappings.forEach((v)) FINNISH
    }

    // This is the join function for calling keybind functions, basically just for pressed method.
    manageInputMethod(key, trigger)
    {
        if (trigger == InputMethod.Down)
        {
            if (!this.keysDown.includes(key)) // and is a valid key in mappings
            {
                this.keysDown.push(key);
            }
            this.manageKeybind(key, method);
        }
        else if (trigger == InputMethod.Up)
        {
            if (this.keysDown.includes(key))
            {
                // Keybind is pressed
                this.keysDown.indexOf(key);
                this.keysDown.splice(key, 1);

                this.manageKeybind(key, InputMethod.Pressed);
            }

            this.manageKeybind(key, method); // Default
        }
    }
}
