var Commands = function(){
  this.commands = ["git init"];
};

Commands.prototype = {
  add: function(command) {
    this.commands.push(command);
  },

  list: function() {
    var i, styled = [];
    for(i = 0; i < this.commands.length; i++) {
      styled.push("<li>" + this.commands[i] + "</li>");
    }
    return styled;
  }
}