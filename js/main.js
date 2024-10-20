
class RegnumLab
{
    constructor()
    {
        this.scene = new RegnumScene();
        this.stats = new RegnumStats();
        this.defaults();
    }

    init()
    {
        this.scene.init();

        this.scene.createPlane("plane", 5, 5);
    }

    animate(deltaTime) 
    {
        requestAnimationFrame(()=>{ this.animate(this.stats.update()); });
        //this.stats.fps.textContent = "FPS 120";

        this.scene.renderer.render(this.scene.scene, this.scene.camera);
    }

    onWindowResize()
    {
        console.log("resize");
        this.scene.camera.aspect = window.innerWidth / window.innerHeight;
        this.scene.camera.updateProjectionMatrix();
        this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    defaults()
    {
        window.addEventListener("resize", ()=>{this.onWindowResize()})
        this.init();
        this.animate();
    }
}

const LAB = new RegnumLab();