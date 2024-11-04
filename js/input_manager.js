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
 * @param {dict} modifiers - List of the modifiers
 * @returns {Input} The keybind
 */
class Input
{
    constructor(keycode, modifiers={})
    {
        this.keycode = keycode;
        this.modifiers = modifiers;
    }

    /**
     * 
     * @param {*} value 
     * @param {string} axis 
     * @returns 
     */
    negateValue(value, axis)
    {
        if (typeof(value) == "boolean")
        {
            return !value;
        }
        else if (typeof(value) == "number")
        {
            return value * -1;
        }
    }

    readModifiers(value)
    {
        let newValue = value;
        for (const [key, value] of Object.entries(this.modifiers)) {
            if (key == "negate")
            {
                if (value == true || typeof(value) != "boolean" && value != null)
                {
                    newValue = this.negateValue(newValue, value);
                }
            }
        }
        return newValue;
    }

    getValue(valueType)
    {
        if (valueType == InputValueType.Bool)
        {
            return this.readModifiers(true);
        }
        else if (valueType == InputValueType.Float)
        {
            return this.readModifiers(1);
        }
    }
}

/**
 * Creates a keybind action | basically manages when and what a keybind returns
 * 
 * @param {InputMethod} inputTriggerMethod - When the action fires
 * @param {InputValueType} valueType - What returns when action fires
 * @param {array} inputs - An array  of all the inputs
 * @param {event} event - Callback when key is triggered
 * @returns {InputAction} The class
 */
class InputAction
{
    constructor(
        triggerMethod=InputTriggerMethod.Up,
        valueType=InputValueType.bool,
        inputs=[],
        event
    )
    {
        this.triggerMethod = triggerMethod;
        this.valueType = valueType;
        this.inputs = inputs;
        this.event = event;
        this.value = null;
        this.inputBeingTriggered = false;
        this.applyDefaultValue();
    }

    /**
     * Returns the current input action value
     * @returns {*} value
     */
    getValue()
    {
        return this.value;
    }

    /**
     * Returns if any input is being triggered
     * @returns {boolean}
     */
    isBeingTriggered()
    {
        return this.inputBeingTriggered;
    }

    /**
    * @private
    */
    applyDefaultValue()
    {
        if (this.valueType == InputValueType.Bool)
        {
            this.value = false;
        }
        else if (this.valueType == InputValueType.Float)
        {
            this.value = 0;
        }
        else if (this.valueType == InputValueType.Vector2)
        {
            this.value = new THREE.Vector2();
        }
        else if (this.valueType == InputValueType.Vector2)
        {
            this.value = new THREE.Vector3();
        }
    }

    /**
    * @private
    */
    doValue(input, triggerMethod)
    {
        if (triggerMethod == InputTriggerMethod.Up)
        {
            this.inputBeingTriggered = false;
            this.applyDefaultValue();
        }
        else if (triggerMethod == InputTriggerMethod.Down)
        {
            this.inputBeingTriggered = true;
        }
        if (triggerMethod != InputTriggerMethod.Up)
        {
            this.value = input.getValue(this.valueType);
        }
    }

    /**
    * @private
    */
    getInput(keycode)
    {
        let foundInput = null; 
        this.inputs.forEach((input)=>{
            if (input.keycode == keycode)
            {
                foundInput = input;
            }
        });
        return foundInput;
    }

    /**
    * @private
    */
    triggerKey(key, triggerMethod)
    {
        this.doValue(this.getInput(key), triggerMethod);

        if (triggerMethod == this.triggerMethod && this.event != null)
        {
            this.event(this.value);
        }
    }
}

/**
 * Create an Input Mapping
 * 
 * @param {InputAction} actions - An array of actions
 * @returns {InputMapping} The class
 */
class InputMapping
{
    constructor(actions=[])
    {
        this.actions = actions;
    }

    /**
    * @private
    */
    manageKeybind(key, trigger)
    {
        // Go through all actions, 
        // check if the trigger methods are the same if so 
        // then look for if any of the keycodes match then execute
        this.actions.forEach((action)=>{
            action.inputs.forEach((keyClass)=>{
                if (keyClass.keycode == key)
                {
                    // The keycode is being triggered
                    //console.log("Keybind is triggered: " + keyClass + ", " + trigger);
                    action.triggerKey(keyClass.keycode, trigger);
                }
            });
        });
        /*this.actions.forEach((action)=>{
            if (action.triggerMethod == trigger)
            {
                action.inputs.forEach((keyClass)=>{
                    if (keyClass.keycode == key)
                    {
                        // The keycode is being triggered
                        //console.log("Keybind is triggered: " + keyClass + ", " + trigger);
                        action.triggerKey(keyClass.keycode);
                    }
                });
            }
        });*/
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
            //
            this.canvas.addEventListener("click", (e)=>{ 
                //this.canvas.requestPointerLock(); 
                //this.canvas.focus();
            })
            window.addEventListener("beforeunload", (event) => {
                event.preventDefault();
               //event.returnValue = ''; // Some browsers require this for the dialog to show
            });
            window.addEventListener("unload", (event) => {
                event.preventDefault();
            });
            this.canvas.addEventListener("keydown", (e)=>{ 
                e.preventDefault();
                this.manageInputMethod(e.key.toLowerCase(), InputTriggerMethod.Down); 
            })
            this.canvas.addEventListener("keyup", (e)=>{ 
                this.manageInputMethod(e.key.toLowerCase(), InputTriggerMethod.Up); 
            })
        }
    }

    /**
    * Adds an input mapping to the current input manager.
    * @param {InputMapping} inputMapping - An InputMapping class
    */
    addInputMapping(inputMapping)
    {
        this.mappings.push(inputMapping);
    }

    /**
    * @private
    */
    manageKeybind(key, trigger)
    {
        this.mappings.forEach((mapping)=>{
            mapping.manageKeybind(key, trigger);
        });
    }

    /**
    * @private
    * This is the join function for calling keybind functions, basically just for pressed method.
    */
    manageInputMethod(key, trigger)
    {
        // Add spacebar key
        key = key == " " ? "space" : key;

        //console.log("key: " + key);

        if (trigger == InputTriggerMethod.Down)
        {
            if (!this.keysDown.includes(key)) // and is a valid key in mappings
            {
                this.keysDown.push(key);
            }
            this.manageKeybind(key, trigger);
        }
        else if (trigger == InputTriggerMethod.Up)
        {
            if (this.keysDown.includes(key))
            {
                // Keybind is pressed
                this.keysDown.indexOf(key);
                this.keysDown.splice(key, 1);

                this.manageKeybind(key, InputTriggerMethod.Pressed);
            }

            this.manageKeybind(key, trigger); // Default
        }
    }
}
