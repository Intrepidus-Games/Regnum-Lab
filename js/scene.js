class RegnumScene
{
    constructor()
    {
        this.scene = null;
        this.renderer = null;
        this.camera = null;

        this.sceneList = {};
    }

    init()
    {
        console.log("INIT SUCCESS");
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    
        document.body.appendChild(this.renderer.domElement);
    
        // Camera Defaults
        this.camera.position.z = 5;
        this.camera.rotation.x = 0.5;
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

        console.log(this.sceneList);
    }

    createPlane(name="object", x=1, y=1, color=0xffff00)
    {
        const geometry = new THREE.PlaneGeometry( x, y );
        const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        //plane.rotation.x = 90;

        this.addToScene(name, plane);

        return plane;
    }
}