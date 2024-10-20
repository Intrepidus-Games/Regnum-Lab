class RegnumStats
{
    constructor()
    {
        this.deltaTime = Date.now();
        this.lastUpdate = null;
        this.fps = document.getElementById("regnum-fps");
        //this.update();
    }

    update()
    {
        const now = Date.now();
        this.deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        this.updateFpsStat();

        return this.deltaTime;
    }

    updateFpsStat()
    {
        this.fps.textContent = `FPS ${this.deltaTime}`
    }
}