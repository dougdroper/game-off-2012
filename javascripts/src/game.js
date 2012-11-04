var Game = function() {
  this.board = new Board();
  this.board.game = this;
  this.commands = new Commands();
  this.state = true;
};

Game.prototype = {
  loose: function() {
    $("#message").empty().html("Try again");
    $("#commands ul").empty();
    this.board.layer.removeChildren();
    this.commands = new Commands();
    this.newGame();
  },
  win: function() {
    $("#message").empty().html("You won");
  },
  newGame: function() {
    this.board.setUp();
  }
}