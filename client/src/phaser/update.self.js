const updateSelf = game => {

  game.container.body.velocity.set(0, 0);
  game.isMoving = false;
  game.isMovingX = false;
  let velocity = 250;
  if(game.keyShift.isDown)
    velocity *= 2

  if(game.key1.isDown) {
    game.player.setTexture('tritondude');
    game.playerSprite = 'tritondude';
  }
  if(game.key2.isDown) {
    game.player.setTexture('sungod');
    game.playerSprite = 'sungod';
  }
  if(game.key3.isDown) {
    game.player.setTexture('queen');
    game.playerSprite = 'queen';
  }
  if(game.key4.isDown) {
    game.player.setTexture('neptune');
    game.playerSprite = 'neptune';
  }
  if(game.key5.isDown) {
    game.player.setTexture('pokeman');
    game.playerSprite = 'pokeman';
  }

  //Reset player position to Geisel
  game.keyEnter.on('down', function(event) {
    game.container.x = 1000*game.boothCount - 128
    game.container.y = 200
  });

  //TODO: Fix animations so that sprite always stops at standing frame

  if (game.keyA.isDown) {
    //game.menu.visible = true;
    game.container.body.setVelocityX(-velocity);
    game.isMoving = true;
    game.isMovingX = true;
    game.player.anims.play('walkLeft-' + game.playerSprite, true);

    game.doUpdate = true
  } else if (game.keyD.isDown) {
    game.container.body.setVelocityX(velocity);
    game.isMovingX = true;
    game.isMoving = true;
    game.player.anims.play('walkRight-' + game.playerSprite, true);

    game.doUpdate = true
  }

  if (game.keyW.isDown) {
    game.container.body.setVelocityY(-velocity);
    game.isMoving = true;
    if (!game.isMovingX) {
      game.player.anims.play('walkUp-' + game.playerSprite, true);
    }

    game.doUpdate = true
  } else if (game.keyS.isDown) {
    game.container.body.setVelocityY(velocity);
    game.isMoving = true;
    if (!game.isMovingX) {
      game.player.anims.play('walkDown-' + game.playerSprite, true);
    }

    game.doUpdate = true
  }
  if(!game.isMoving){
    game.player.anims.stop(null, true);

    game.doUpdate = false
  }

  // Socket Update
  if(game.doUpdate)
    game.socket.emit('move-player', {
      x: game.container.x,
      y: game.container.y,
      vx: game.container.body.velocity.x,
      vy: game.container.body.velocity.y,
      sprite: game.playerSprite,
      playerId: game.socket.id
    });
}

export default updateSelf
