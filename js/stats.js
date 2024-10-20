class RegnumStats
{
    constructor()
    {
        this.deltaTime = performance.now();
        this.lastUpdate = null;
        this.fps = document.getElementById("regnum-fps");
        this.statUpdateInterval = 0.5;
        this.lastStatUpdate = 0;

        //this.update();
    }

    update()
    {
        const now = performance.now();
        const secNow = now/1000;
        this.deltaTime = (now - this.lastUpdate)/1000;
        this.lastUpdate = now;

        if (secNow - this.lastStatUpdate > this.statUpdateInterval)
        {
            this.lastStatUpdate = secNow;
            this.updateFpsStat();
        }

        return this.deltaTime;
    }

    updateFpsStat()
    {
        this.fps.textContent = `FPS ${Math.round(1/this.deltaTime)}`
    }
}