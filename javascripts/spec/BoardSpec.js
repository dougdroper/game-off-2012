describe("Baord", function() {
  var board;

  beforeEach(function() {
    board = new Board();
    board.setUp();
  });

  it("should have a master branch from start block to end block", function() {
    expect(board.master).toEqual([55, 75, 550, 75]);
  });

  it("should have a blocker halfway between the stage", function() {
    expect(board.blocker.getPosition().x).toEqual(310);
  });

  it("should have a current_position of the start block", function() {
    expect(board.current_position).toEqual({x:0, y:50});
  });

  it("commits", function() {
    board.commit();
    expect(board.last_position).toEqual({x:0, y:50});
    expect(board.current_position).toEqual({x:110, y:50});
  });

  it("commits twice", function() {
    board.commit();
    board.commit();
    expect(board.last_position).toEqual({x:110, y:50});
    expect(board.current_position).toEqual({x:220, y:50});
  });

  it("changes branch", function() {
    board.changeBranch();
    expect(board.last_position).toEqual({x:0, y:50});
    expect(board.current_position).toEqual({x:0, y:100});
  });

  it("merges from a branch", function() {
    board.changeBranch();
    board.merge();
    expect(board.onbranch()).toBe(false);
    expect(board.current_position).toEqual({x:0, y:50});
  });

  it("merges from second branch", function() {
    board.changeBranch();
    board.merge();
    board.merge();
    board.merge();
    expect(board.current_position.y).toBe(board.master_branch)
  });

  it("cant merge if not on a branch", function() {
    expect(board.merge()).toEqual("Can not merge when your not on a branch");
  });

  describe("Collisions", function() {
    var game;
    beforeEach(function(){
      game = {
        loose: function() {
          return true;
        },
        win: function() {
          return true;
        }
      };
      spyOn(game, "loose");
      spyOn(game, "win");
      board.game = game;
    });

    it("checks for a collision", function() {
      expect(board.checkCollission()).toBe(false);
    });

    it("player collides with the blocker", function() {
      board.commit();
      board.commit();
      board.commit();
      expect(game.loose).toHaveBeenCalled();
      board.layer.removeChildren();
      board.setUp();
      expect(board.layer.children.length).toBe(5);
    });

    it("resets a game", function() {
      board.commit();
      expect(board.current_position).toEqual({x:110, y:50});
      board.reset();
      expect(game.loose).toHaveBeenCalled();
    });

    describe("Winning", function() {
      it("wins when the player reaches the end", function() {
        board.changeBranch();
        board.commit();
        board.commit();
        board.commit();
        board.commit();
        board.merge();
        board.commit();
        expect(game.win).toHaveBeenCalled();
      });
    });
  });
});