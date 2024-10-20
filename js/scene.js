class RegnumSceneObject
{
    constructor(name, object)
    {
        this.name = name
        this.object = object;
        this.lookAtCameraEnabled = false
    }

    lookAtCamera(enabled)
    {
        this.lookAtCameraEnabled = enabled;
    }
}

class RegnumScene
{
    constructor()
    {
        this.scene = null;
        this.renderer = null;
        this.camera = null;

        this.canvas = null;

        // mouse
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        this.sceneList = [];

        this.fonts = {
            "NunitoSansRegular": null
        }
    }

    init()
    {
        this.canvas = document.getElementById("scene");

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.offsetWidth / this.canvas.offsetHeight,
            0.1,
            1000
        );
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
    
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);


        this.canvas.appendChild(this.renderer.domElement);


        // Camera Defaults
        this.camera.position.y = -5;
        this.camera.position.z = 5;
        this.camera.rotation.x += deg2rad(180);
        this.camera.rotation.x = deg2rad(45);

        // Create scene defaults

        // Load Fonts
        this.loadFonts(()=>{
            const x = this.createTextLabel("x", "x", 0xff000d, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(2,0,0)
            ], 0xff000d);

            const y = this.createTextLabel("y", "y", 0x22ba00, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,2,0)
            ], 0x22ba00);
            const z = this.createTextLabel("z", "z", 0x0800ff, true);
            this.createLine("origin", [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,0,2)
            ], 0x0800ff);
            x.position.x = 2;
            y.position.y = 2;
            z.position.z = 2;
        });
        
        window.addEventListener("resize", ()=>{this.onWindowResize()})
        this.renderer.domElement.addEventListener("mousedown", ()=>{ this.isDragging=true; })
        this.renderer.domElement.addEventListener("mouseup", ()=>{  this.isDragging=false; })
        this.renderer.domElement.addEventListener("mouseout", ()=>{ this.isDragging=false; })
        this.renderer.domElement.addEventListener("mousemove", (e)=>{ this.mouseMove(e); })
    }

    loadFonts(callback)
    {
        // Create the font loader
        const fontLoader = new THREE.FontLoader();

        // Load the font and store it in the "fonts" object
        fontLoader.load('fonts/Nunito Sans 10pt_Regular.json', (font) => {
            // Assuming 'this.fonts' is an object to store loaded fonts
            this.fonts = this.fonts || {}; // Initialize if not already present
            this.fonts["NunitoSansRegular"] = font;

            console.log("Font loaded:", font);
            if (callback) callback();
        });
    }

    mouseMove(event)
    {
        // If the mouse is being dragged
        if (this.isDragging) {
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };
        
            // Example: Rotate the object based on mouse movement
            const rotationSpeed = 1;
            rotateAround(this.camera, new THREE.Vector3(0,0,0), new THREE.Vector3(-deltaMove.y/2, 0,-deltaMove.x/2));
        }
        
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    onWindowResize()
    {

        this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    }

    getNameCountIn(array, string)
    {
        let count = 0;
        for (let obj of array) {
            if (obj.namee.startsWith(string)) {count++;}
        }
        return count;
    }
    
    doSceneUpdate(deltaTime)
    {
        for (let obj of this.sceneList) {
            if (obj.lookAtCameraEnabled)
            {
                //bj.object.lookAt(this.camera.position);
                lookAt(obj.object, this.camera);
            }
        }
    }

    addToScene(name, obj)
    {
        this.scene.add(obj);
        let objName = name;
        if (this.sceneList[name] != null)
        {
            const count = this.getNameCountIn(this.sceneList, name);
            objName = name+(count+1);
            //this.sceneList[name+(count+1)] = obj;
        } 
        const object = new RegnumSceneObject(objName, obj);
        this.sceneList.push(object);
        return object;
        //console.log(this.sceneList);
    }

    createPlane(name="plane", vector=new THREE.Vector2(1,1), color=0x353738)
    {
        const geometry = new THREE.PlaneGeometry( vector.x, vector.y );
        const material = new THREE.MeshBasicMaterial( {color: color} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
    createBox(name="box", vector=new THREE.Vector2(1,1, 1), color=0x484359)
    {
        const geometry = new THREE.BoxGeometry( vector.x, vector.y, vector.z );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
    createLine(name="line", points=[new THREE.Vector3( - 10, 0, 0 ), new THREE.Vector3( 0, 10, 0 ), new THREE.Vector3( 10, 0, 0 )], color=0xbddbf0)
    {
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.MeshBasicMaterial( {color: color} );
        const line = new THREE.Line( geometry, material );

        this.addToScene(name, line);
    }
    createTextLabel(name = "text", text = "text", color = 0xbddbf0, lookAtCamera = false) {
        // Create the text geometry after the font is loaded
        const textGeometry = new THREE.TextGeometry(text, {
            font: this.fonts["NunitoSansRegular"],
            size: 0.5,
            height: 0.01,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });

        // Create the material for the text
        const textMaterial = new THREE.MeshBasicMaterial({ color: color });
        
        // Create the mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Add the text mesh to the scene
        const object = this.addToScene(name, textMesh);
        object.lookAtCamera(lookAtCamera);
        return textMesh;
    }
}