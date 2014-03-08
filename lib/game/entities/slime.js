ig.module(
	'game.entities.slime'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntitySlime = ig.Entity.extend({
  name: 'slime',

	size: {x: 22, y: 12},
  offset: {x: 1, y: 9},
	
	friction: {x: 10000, y: 10000},
  maxVel: {x: 25, y: 25},
	
	type: ig.Entity.TYPE.B, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet('media/slime.png', 24, 21),
	
  // Internal properties
	walkAccel: 5000,
  wanderOnTicks: 60,
  wanderOffTicks: 80,
  wanderVel: 40,
  angryVel: 55,
  visionRange: 5 * 16,
  desiredPlayerDistance: 5,
	health: 10,
  facing: 'd',
  maxHealth: 4,
  health: 2.5,
  shadow: new ig.Image('media/character-shadow.png'),
  angry: false,
  colors: ['green', 'blue', 'red'],
  color: 'red', // Override me
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings);
		
		// Add the animations
    var animOffset = this.colors.indexOf(this.color);
		this.addAnim('idle-d', 1, [animOffset]);
		this.addAnim('walk-d', 0.3, [animOffset, animOffset + 3]);
		this.addAnim('idle-r', 1, [animOffset + 6]);
		this.addAnim('walk-r', 0.3, [animOffset + 6, animOffset + 9]);
		this.addAnim('idle-u', 1, [animOffset + 12]);
		this.addAnim('walk-u', 0.3, [animOffset + 12, animOffset + 15]);
    animOffset += 18; // Angry eyes!
		this.addAnim('idle-d-angry', 1, [animOffset]);
		this.addAnim('walk-d-angry', 0.3, [animOffset, animOffset + 3]);
		this.addAnim('idle-r-angry', 1, [animOffset + 6]);
		this.addAnim('walk-r-angry', 0.3, [animOffset + 6, animOffset + 9]);
		this.addAnim('idle-u-angry', 1, [animOffset + 12]);
		this.addAnim('walk-u-angry', 0.3, [animOffset + 12, animOffset + 15]);
	},
	
	update: function() {
    // Are we angry?
    var player = ig.game.getEntityByName('player');
    this.angry = player && this.distanceTo(player) < this.visionRange;

    this.accel.x = 0;
    this.accel.y = 0;

    if(this.angry) {
      this.maxVel = {x: this.angryVel, y: this.angryVel};
      var playerDX = player.pos.x - this.pos.x;
      var playerDY = player.pos.y - this.pos.y;
      if(playerDY > this.desiredPlayerDistance) {
        this.accel.y = this.walkAccel;
      } else if(playerDY < -this.desiredPlayerDistance) {
        this.accel.y = -this.walkAccel;
      }
      if(playerDX > this.desiredPlayerDistance) {
        this.accel.x = this.walkAccel;
      } else if(playerDX < -this.desiredPlayerDistance) {
        this.accel.x = -this.walkAccel;
      }
    } else { // Wander
      this.maxVel = {x: this.wanderVel, y: this.wanderVel};
      if(this.wanderTimer == undefined || this.wanderTimer ==
         this.wanderOnTicks + this.wanderOffTicks) {
        this.wanderTimer = 0;
        this.wanderX = Math.floor(Math.random()*3)-1;
        this.wanderY = Math.floor(Math.random()*3)-1;
      }
      this.wanderTimer += 1;
      if(this.wanderTimer > this.wanderOffTicks) {
        this.accel.x = this.walkAccel * this.wanderX;
        this.accel.y = this.walkAccel * this.wanderY;
      }
    }

    if(this.vel.x > 0) {
      this.facing = 'r';
    } else if(this.vel.x < 0) {
      this.facing = 'l';
    } else if(this.vel.y < 0) {
      this.facing = 'u';
    } else if(this.vel.y > 0) {
      this.facing = 'd';
    }

    var animName;
		// set the current animation, based on the slime's speed, direction and mood
		if(this.vel.x != 0 || this.vel.y != 0) {
      animName = 'walk-';
		} else {
      animName = 'idle-';
		}
    if(this.facing == 'l') {
      animName += 'r';
    } else {
      animName += this.facing;
    }
    if(this.angry) animName += '-angry';

    this.currentAnim = this.anims[animName];
    this.currentAnim.flip.x = (this.facing == 'l');

		// move!
		this.parent();
	},

  draw: function() {
    ig.system.context.globalAlpha = 0.7;
    this.shadow.draw(
			this.pos.x + 4 - this.offset.x - ig.game._rscreen.x,
			this.pos.y + 13 - this.offset.y - ig.game._rscreen.y
    );
    ig.system.context.globalAlpha = 1.0;
    this.parent();
  }
});
});
