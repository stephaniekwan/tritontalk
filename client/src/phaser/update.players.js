const updateSelf = game => {

  while(game.player_updates.length > 0){

    const {x, y, vx, vy, sprite, playerId} = game.player_updates.shift()

    console.log(x, y, playerId)

    if(game.players[playerId]){

      game.tweens.add({
        targets: game.players[playerId],
        x: x,
        y: y,
        duration: 50,
        ease: 'Linear',
        delay: 0
      });

      console.log(sprite);


      if (vx < 0) {
        game.players[playerId].first.anims.play('walkLeft-' + sprite, true);
      }
      else if (vx > 0) {
        game.players[playerId].first.anims.play('walkRight-' + sprite, true);
      }
      else if (vy < 0) {
        game.players[playerId].first.anims.play('walkUp-' + sprite, true);
      }
      else if (vy > 0) {
        game.players[playerId].first.anims.play('walkDown-' + sprite, true);
      }
      else {
        game.players[playerId].first.anims.stop();
      }
    }
  }
}

export default updateSelf
