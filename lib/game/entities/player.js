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
  offset: {x: 22, y: 33},
	
	friction: {x: 10000, y: 10000},
  maxVel: {x: 75, y: 75},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet('media/player.png', 60, 60),
	
  // Internal properties
	walkAccel: 5000,
	health: 10,
  facing: 'd',
  shadow: new ig.Image('media/character-shadow.png'),
  maxHealth: 4,
  health: 2.5,
  maxShield: 5,
  shield: 4,
  attacking: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim('idle-d',  0.2,   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,4,4]);
		this.addAnim('idle-u',  1,     [20]);
		this.addAnim('idle-r',  0.2,   [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,13]);
		this.addAnim('walk-d',  0.15,  [0,1,0,2]);
		this.addAnim('walk-u',  0.15,  [20,21,20,22]);
		this.addAnim('walk-r',  0.15,  [10,11,10,12]);
    this.addAnim('attack-d', 0.06, [30, 31, 32, 33, 34, 35], true);
    this.addAnim('attack-r', 0.06, [40, 41, 42, 43, 44, 10], true);
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

    var animDir = (this.facing == 'l' ? 'r' : this.facing);

    if(ig.input.state('attack') && !this.attacking) {
      this.anims['attack-' + animDir].rewind()
      this.attacking = true;
    }
    
    if(this.attacking && this.anims['attack-' + animDir].loopCount > 0) {
      this.attacking = false;
    }

		// set the current animation
    if(this.attacking) {
      this.currentAnim = this.anims['attack-' + animDir];
		} else if(this.vel.x != 0 || this.vel.y != 0) {
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
			this.pos.x - ig.game._rscreen.x,
			this.pos.y + 1 - ig.game._rscreen.y
    );
    ig.system.context.globalAlpha = 1.0;
    this.parent();
  }
});
});
