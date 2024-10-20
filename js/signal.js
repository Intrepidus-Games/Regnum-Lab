class SignalFloat
{
    constructor()
    {
        this.subscribers = []
    }
    subscribe(caller)
    {
        this.subscribers.push(caller);
    }
    fire(float)
    {
        this.subscribers.forEach((subscriber)=>{
            subscriber(float);
        })
    }
}