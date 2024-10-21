
class RegnumLab
{
    constructor()
    {
        this.events = {
            "update": new SignalFloat()
        }
        this.scene = new RegnumScene();
        this.stats = new RegnumStats();
        this.defaults();
    }

    init()
    {
        this.scene.init();

        //this.scene.createPlane("plane", 5, 5);
        //this.scene.createBox("box", 5, 5);

        //this.scene.createLine();
    }

    animate(deltaTime) 
    {
        this.scene.doSceneUpdate(this.stats.deltaTime);
        this.events["update"].fire(this.stats.deltaTime);
        //this.stats.fps.textContent = "FPS 120";

        //rotateAround(this.scene.camera, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,1));

        this.scene.renderer.render(this.scene.scene, this.scene.camera);
        requestAnimationFrame(()=>{ this.animate(this.stats.update()); });
    }

    defaults()
    {
        this.init();
        this.animate();
    }

    addEvent(event, caller)
    {
        if (this.events[event] != null)
        {
            this.events[event].subscribe(caller);
        }
        else
        {
            console.error(`The event: '${event} does not exist.'`);
        }
    }
}

const REGNUMLAB = new RegnumLab();