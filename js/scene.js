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

        this.sceneList = {};
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
        this.createLine("origin", [
            new THREE.Vector3(0,0,10),
            new THREE.Vector3(0,0,0)
        ]);

        window.addEventListener("resize", ()=>{this.onWindowResize()})
        this.renderer.domElement.addEventListener("mousedown", ()=>{ this.isDragging=true; })
        this.renderer.domElement.addEventListener("mouseup", ()=>{  this.isDragging=false; })
        this.renderer.domElement.addEventListener("mouseout", ()=>{ this.isDragging=false; })
        this.renderer.domElement.addEventListener("mousemove", (e)=>{ this.mouseMove(e); })
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

    getKeysAmountIn(dict, string)
    {
        let count = 0;
        for (const [key, value] of Object.entries(dict)) {
            if (key.startsWith(string)) {count++;}
        }
        return count;
    }
    
    addToScene(name, obj)
    {
        this.scene.add(obj);
        if (this.sceneList[name] != null)
        {
            const count = this.getKeysAmountIn(this.sceneList, name);
            this.sceneList[name+(count+1)] = obj;
        } 
        else
        {
            this.sceneList[name] = obj;
        }

        //console.log(this.sceneList);
    }

    createPlane(name="plane", vector=new THREE.Vector2(1,1), color=0x353738)
    {
        const geometry = new THREE.PlaneGeometry( vector.x, vector.z );
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

        this.addToScene("lines", line);
    }
}