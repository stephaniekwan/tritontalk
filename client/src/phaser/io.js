import io from 'socket.io-client';
import {storage} from '../utils/firebase.js'

const URL = process.env.NODE_ENV === 'production' || process.env.REACT_APP_VARIABLE === 'docker' ? 
            '' : 'http://localhost:3001'

const createSocket = game => {

  game.socket = io(URL, {transport: ['websocket']})
  game.playerData = null
  game.player_updates = []
  game.players = {}
  
  game.booth_list = {}

  //communicate our current state on instantiation
  game.socket.on('ready', () => {
    game.socket.emit('new-player', {
      x: game.container.x,
      y: game.container.y,
      vx: 0,
      vy: 0,
      playerId: game.socket.id,
      sprite: game.playerSprite, 
      name: game.name,
      college: game.college
    });
  });

  game.socket.on('update-player-location', data => {
    game.player_updates.push(data)
  })

  game.socket.on('new-player', data => {
    addPlayer(data, game)
  })

  game.socket.on('delete-player', data => {
    if(game.players[data])
      game.players[data].destroy()
  })

  game.socket.on('current-players', (data) => {
    for(let playerId in data){
      if(playerId === game.socket.id)
        continue

      addPlayer(data[playerId], game)
    }
  })

  game.socket.on('current-rooms', (data) => {
    for(let boothId in data){
      addBooth(data[boothId], game)
      game.booth_list[data[boothId].index] = data[boothId]
    }
  })

  game.socket.on('new-room', data => {
    console.log(data)
    addBooth(data, game)
    game.booth_list[data.index] = data
  })

  game.socket.on('delete-room', index => {
    console.log(game.booths, index)
    if(!game.booths[index])
      return 
    game.booths[index].list[2].setTexture('transparent')
    game.booths[index].list[2].displayWidth = 150;
    game.booths[index].list[2].displayHeight = 150;

    game.booths[index].list[0].text = 'No Club yet';

    delete game.booth_list[index]
  })
}

const addPlayer = (player, game) => {

  const {x, y, playerId, name, college} = player

  //Set player position
  let newplayer = game.physics.add.sprite(0, 0, 'tritondude');

  //Allow players to interact with each other via mouse hovers and clicks
  newplayer.setInteractive()
  newplayer.on('pointerover', function (pointer) {
    newplayer.setTint(0x7d95ff);
  });

  newplayer.on('pointerout', function (pointer) {
    newplayer.clearTint();
  });

  newplayer.on('pointerdown', function (pointer) {
    game.menu.visible = true;
  });

  //game.player.setCollideWorldBounds(true);
  newplayer.setOrigin(0.5, 0.5);

  //Player text shows name and college, follows player
  var playerStyle = {
    font: '12px Arial',
    fill: 'BLUE',
    wordWrap: true,
    wordWrapWidth: newplayer.width,
    align: 'center'
  };

  var newPlayerText = game.add.text(0, -50, name + '\n' + college, playerStyle)
  newPlayerText.setOrigin(0.5, 0.5);

  //User controls a container which contains the player sprite and player text
  const container = game.add.container(x, y, [newplayer, newPlayerText]);
  container.setSize(64, 64);
  game.physics.world.enable(container);
  container.body.setCollideWorldBounds(true);
  container.depth = 1000
  container.bringToTop(newPlayerText);
  game.players[playerId] = container
}

const addBooth = async (data, game) => {
    const url = await storage.ref('booth_' + data.name + '.jpg').getDownloadURL()

    game.load.image('booth_image' + data.name, url);

    game.load.once('complete', () => {
      console.log("finished loading image")
      game.booths[data.index].list[2].setTexture('booth_image' + data.name)
      game.booths[data.index].list[2].displayWidth = 150;
      game.booths[data.index].list[2].displayHeight = 150;

      game.booths[data.index].list[1].text = data.name
    }, this);

    game.load.start();
    
    // update client-side booth array once we have this stuff on backend
}


export default createSocket
