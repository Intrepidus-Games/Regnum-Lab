class FloatSpring
{
    constructor(stiffness=100, damping=5)
    {
        // Settings
        this.stiffness = stiffness;
        this.damping = damping;

        // Variables
        this.position = 0;
        this.velocity = 0;
        this.target = 0;
    }

    update(deltaTime=0)
    {
        const springForce = -this.stiffness * (this.position - this.target);
        const dampingForce = -this.damping * this.velocity;
        const netForce = springForce + dampingForce;

        this.velocity += netForce * deltaTime;
        this.position += this.velocity * deltaTime;
    }

    push(target=0)
    {
        this.target = target;
    }

    getPosition()
    {
        return this.position;
    }
    getVelocity()
    {
        return this.velocity;
    }
}

class Vector2Spring
{
    constructor(stiffness, damping)
    {
        this.x = new FloatSpring(stiffness, damping);
        this.y = new FloatSpring(stiffness, damping);
    }

    update(deltaTime=0)
    {
        this.x.update(deltaTime);
        this.y.update(deltaTime);
    }

    push(target=new THREE.Vector2)
    {
        this.x.push(target.x);
        this.y.push(target.y);
    }

    getPosition()
    {
        return new THREE.Vector2(this.x.getPosition(), this.y.getPosition());
    }
    getVelocity()
    {
        return new THREE.Vector2(this.x.getVelocity(), this.y.getVelocity());
    }
}