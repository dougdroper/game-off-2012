var Levels = function() {
  var level;
  var layer;
  this.stage = new Kinetic.Stage({
    container: 'container',
    width: 600,
    height: 300
  });

  layer = new Kinetic.Layer();

  _.each([0,1,2,3,4,5,6,7,8,9], function(num) {
    level = new Kinetic.Rect({
      name: "level_" + num,
      x: num * 50,
      y: 0,
      width: 50,
      height: 50,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 2
    });
    level.on("click", function(evt) {
      var game = new Game();
      game.newGame();
    });
    layer.add(level);
  });

  this.stage.add(layer);
}

