ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
  'game.levels.test',
  'game.entities.player',
  'game.entities.slime'
)
.defines(function(){

MyGame = ig.Game.extend({
	gravity: 0,

  meterInset: 8, // px
  meterTracking: 10, // px

	font: new ig.Font( 'media/04b03.font.png' ),
  meters: new ig.AnimationSheet('media/meters.png', 9, 8),
	
	init: function() {
		// Initialize your game here; bind keys etc.
    ig.input.bind(ig.KEY.A, 'left');
    ig.input.bind(ig.KEY.D, 'right');
    ig.input.bind(ig.KEY.W, 'up');
    ig.input.bind(ig.KEY.S, 'down');

    this.loadLevel(LevelTest);

    ig.game.clearColor = "#ffffff";
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// screen follows the player
 		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
	  }

    // Due to perspective, things to the south are drawn later
    for(var i = 0; i != this.entities.length; i++) {
      this.entities[i].zIndex = this.entities[i].pos.y;
    }
    this.sortEntities();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
 		var player = this.getEntityByName('player');
		if( player ) {
      // Draw health
      healthToShow = player.health;
      for(var i = 0; i != player.maxHealth; i++) {
        this.meters.image.drawTile(
          this.meterInset + (this.meterTracking * i), this.meterInset,
          healthToShow >= 1 ? 0 : (healthToShow == 0.5 ? 1 : 2),
          this.meters.width, this.meters.height
        );
        healthToShow -= 1;
      }
	  }

    // Draw shield
    shieldToShow = player.shield;
    for(var i = 0; i != player.maxShield; i++) {
      this.meters.image.drawTile(
        ig.system.width - (this.meterInset + (this.meterTracking * (i + 1))), this.meterInset,
        shieldToShow >= 1 ? 3 : (shieldToShow == 0.5 ? 4 : 5),
        this.meters.width, this.meters.height
      );
      shieldToShow -= 1;
    }
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 400, 250, 4 );

});
