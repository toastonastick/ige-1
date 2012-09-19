// Define our player character container classes
var CharacterContainer = IgeEntity.extend({
	classId: 'CharacterContainer',

	init: function () {
		var self = this;
		this._super();

		// Setup the entity 3d bounds
		self.size3d(20, 20, 40);

		// Create a character entity as a child of this container
		self.character = new Character()
			.id(this.id() + '_character')
			.setType(3)
			.drawBounds(false)
			.drawBoundsData(false)
			.originTo(0.5, 0.6, 0.5)
			.mount(this);

		this._overTile = IgePoint(0, 0, 0);
	},

	/**
	 * Tweens the character to the specified world co-ordinates.
	 * @param x
	 * @param y
	 * @return {*}
	 */
	walkTo: function (x, y) {
		var self = this,
			distX = x - this.translate().x(),
			distY = y - this.translate().y(),
			distance = Math.distance(
				this.translate().x(),
				this.translate().y(),
				x,
				y
			),
			speed = 0.1,
			time = (distance / speed),
			direction = '';

		// Set the animation based on direction - these are modified
		// for isometric views
		if (distY < 0) {
			direction += 'N';
		}

		if (distY > 0) {
			direction += 'S';
		}

		if (distX > 0) {
			direction += 'E';
		}

		if (distX < 0) {
			direction += 'W';
		}

		switch (direction) {
			case 'N':
				this.character.animation.select('walkRight');
				break;

			case 'S':
				this.character.animation.select('walkLeft');
				break;

			case 'E':
				this.character.animation.select('walkRight');
				break;

			case 'W':
				this.character.animation.select('walkLeft');
				break;

			case 'SE':
				this.character.animation.select('walkDown');
				break;

			case 'NW':
				this.character.animation.select('walkUp');
				break;

			case 'NE':
				this.character.animation.select('walkRight');
				break;

			case 'SW':
				this.character.animation.select('walkLeft');
				break;
		}

		// Start tweening the little person to their destination
		this._translate.tween()
			.stopAll()
			.properties({x: x, y: y})
			.duration(time)
			.afterTween(function () {
				self.character.animation.stop();
			})
			.start();

		return this;
	},

	tick: function (ctx) {
		// Work out which tile we're over and if it's different from
		// the last one we were over, emit an overTile event
		var curTile;

		// Calculate which tile our character is currently "over"
		if (this._parent.isometricMounts()) {
			curTile = this._parent.pointToTile(currentPosition.toIso());
		} else {
			curTile = this._parent.pointToTile(currentPosition);
		}

		if (!curTile.compare(this._overTile)) {
			// Different over tile
			this._overTile = curTile;
			this.emit(this._overTile);
		}

		// Set the depth to the y co-ordinate which basically
		// makes the entity appear further in the foreground
		// the closer they become to the bottom of the screen
		this.depth(this._translate.y);
		this._super(ctx);
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = CharacterContainer; }