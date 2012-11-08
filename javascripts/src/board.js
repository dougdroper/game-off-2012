var Board = function(){
  this.new_branch = [];
  this.master_branch = 50;

  this.stage = new Kinetic.Stage({
    container: 'container',
    width: 600,
    height: 300
  });

  this.layer = new Kinetic.Layer();

  this.simpleText = new Kinetic.Text({
    x: this.stage.getWidth() / 2 - 40,
    y: 15,
    text: "Level 1",
    fontSize: 30,
    fontFamily: "Calibri",
    textFill: "green"
  });

  this.start = new Kinetic.Rect({
    width: 50,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 2
  });

  this.imageObj = new Image();
  this.imageObj.src = "images/house.png";

  this.end = new Kinetic.Image({
    width: 50,
    height: 50,
    image: this.imageObj
  });


  this.start_pos = {x:0,y:this.master_branch};
  this.start.setAttrs(this.start_pos);
  this.end_pos = {x:(this.stage.getWidth() - this.end.getWidth()), y:this.master_branch};
  this.end.setAttrs(this.end_pos)

  this.current_position = {x:this.start_pos.x, y:this.start_pos.y};

  this.master = [
    this.start.getPosition().x + this.start.getWidth() + 5,
    this.start.getPosition().y + (this.start.getHeight() / 2),
    this.end.getPosition().x,
    this.end.getPosition().y + (this.end.getHeight() / 2),
  ]

  this.masterBranch = new Kinetic.Line({
    points: this.master,
    stroke: "green",
    strokeWidth: 2,
    lineJoin: "round",
    dashArray: [10, 10]
  });

  this.blocker = new Kinetic.Circle({
    x: (this.stage.getWidth() / 2) + 10,
    y: 75,
    radius: 20,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2
  });

  this.imageObj2 = new Image();
  this.imageObj2.src = "images/arrow.jpg";

  this.player = new Kinetic.Image({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    image: this.imageObj2
  });


  this.resetToStart = function () {
    this.player.transitionTo({
      x: 239, y:this.master_branch, duration: 1
    });
  }
};

Board.prototype = {
  setUp: function() {
    this.last_position = {x:50, y:75};
    this.current_position = {x:this.start_pos.x, y:this.start_pos.y};
    this.layer.add(this.player);
    this.layer.add(this.start);
    this.layer.add(this.end);
    this.layer.add(this.masterBranch);
    this.layer.add(this.blocker);
    this.layer.add(this.simpleText);
    this.stage.add(this.layer);
    this.startPlayer();
    this.player.moveToTop();
  },
  startPlayer: function() {
    this.player.transitionTo({
      x: 0, y:50, duration: 1
    });
  },
  createBranch: function() {
    this.new_branch = [this.current_position.x, this.current_position.y, this.current_position.x + 110, this.current_position.y + 100]
    this.branch = new Kinetic.Line({
      points: this.new_branch,
      stroke: "green",
      strokeWidth: 2,
      lineJoin: "round",
      dashArray: [10, 10]
    });

    this.layer.add(this.branch);
    this.stage.add(this.layer);
  },
  changeBranch: function() {
    this.last_position = this.current_position;
    this.current_position = {x:this.current_position.x, y:(this.current_position.y + 50)};
    this.makeTransition();
  },
  commit: function() {
    this.last_position = this.current_position;
    this.current_position = {x:this.current_position.x + 110, y:this.current_position.y};
    this.makeTransition();
  },
  reset: function() {
    this.game.loose();
  },
  makeTransition: function() {
    if (this.checkCollission()) {
      this.reset();
      return;
    };

    this.player.transitionTo({
      x: this.current_position.x,
      y: this.current_position.y,
      duration: 1
    });
    this.path();

    if (this.finished()) {
      this.game.win();
    };
  },
  path: function() {
    var new_point = [this.last_position.x + 50, this.last_position.y + 25, this.current_position.x + 50, this.current_position.y + 25]
    var line = new Kinetic.Line({
      name: "commit_line",
      points: new_point,
      stroke: "green",
      strokeWidth: 2,
      lineJoin: "round",
      dashArray: [10, 10]
    });

    this.layer.add(line);

    var duration = 1000 ;
    var anim = new Kinetic.Animation({
        func: function(frame) {
            if (frame.time >= duration) {
                anim.stop() ;
            } else {
                line.setOpacity(frame.time / duration) ;
            }
        },
        node: this.layer
    });

    anim.start();
    this.player.moveToTop();
  },
  merge: function() {
    this.last_position = this.current_position;
    if(this.onbranch()){
      this.current_position = {x:this.current_position.x, y:this.current_position.y - 50};
      this.makeTransition();
    } else {
      return "Can not merge when your not on a branch";
    };
  },
  checkCollission: function() {
    return (this.current_position.x === (this.blocker.getPosition().x + 20) && ((this.current_position.y + 25) === this.blocker.getPosition().y));
  },
  finished: function() {
    return (this.current_position.x === this.end.getPosition().x && this.current_position.y  === this.end.getPosition().y);
  },
  onbranch: function() {
    return this.current_position.y != this.master_branch;
  }
}