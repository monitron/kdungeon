ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityPlayer = ig.Entity.extend({
  name: 'player',

	size: {x: 16, y: 8},
  offset: {x: 2, y: 26},
	
	friction: {x: 10000, y: 10000},
  maxVel: {x: 75, y: 75},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet('media/player.png', 20, 33),
	
  // Internal properties
	walkAccel: 5000,
	health: 10,
  facing: 'd',
  shadow: new ig.Image('media/character-shadow.png'),
  maxHealth: 4,
  health: 2.5,
  maxShield: 5,
  shield: 4,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim('idle-d', 0.2, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6]);
		this.addAnim('idle-u', 1, [3]);
		this.addAnim('idle-r', 0.2, [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,10]);
		this.addAnim('walk-d', 0.15, [0,1,0,2]);
		this.addAnim('walk-u', 0.15, [3,4,3,5]);
		this.addAnim('walk-r', 0.15, [7,8,7,9]);
	},
	
	update: function() {
		// move L, R, U or D
    this.accel.x = 0;
    this.accel.y = 0;
		if(ig.input.state('left')) {
			this.accel.x = -this.walkAccel;
      this.facing = 'l';
		} else if(ig.input.state('right')) {
			this.accel.x = this.walkAccel;
      this.facing = 'r';
    }
		if(ig.input.state('up')) {
			this.accel.y = -this.walkAccel;
      this.facing = 'u';
		} else if(ig.input.state('down')) {
			this.accel.y = this.walkAccel;
      this.facing = 'd';
		}

		// set the current animation, based on the player's speed
    var animDir = (this.facing == 'l' ? 'r' : this.facing);
		if(this.vel.x != 0 || this.vel.y != 0) {
			this.currentAnim = this.anims['walk-' + animDir];
		} else {
			this.currentAnim = this.anims['idle-' + animDir];
		}
    this.currentAnim.flip.x = (this.facing == 'l');

		// move!
		this.parent();
	},

  draw: function() {
    ig.system.context.globalAlpha = 0.7;
    this.shadow.draw(
			this.pos.x + 2 - this.offset.x - ig.game._rscreen.x,
			this.pos.y + 27 - this.offset.y - ig.game._rscreen.y
    );
    ig.system.context.globalAlpha = 1.0;
    this.parent();
  }
});
});
