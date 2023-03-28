import Phaser from 'phaser'
import Network from '../services/Network'
import { BackgroundMode } from '../../../types/BackgroundMode'
import store from '../stores'
import { setRoomJoined } from '../stores/RoomStore'

export default class Bootstrap extends Phaser.Scene {
  private preloadComplete = false
  network!: Network

  constructor() {
    super('bootstrap')
  }

  preload() {
    this.load.atlas(
      'cloud_day',
      'assets/background/cloud_day.png',
      'assets/background/cloud_day.json'
    )
    this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    this.load.atlas(
      'cloud_night',
      'assets/background/cloud_night.png',
      'assets/background/cloud_night.json'
    )
    this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    this.load.image('sun_moon', 'assets/background/sun_moon.png')

    this.load.tilemapTiledJSON('tilemap', 'assets2/library.json')
    this.load.spritesheet('tiles_wall', 'assets2/FloorAndGround.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('library_item', 'assets2/library_item.png', {
      frameWidth: 64,
      frameHeight: 96,
    })
    this.load.spritesheet('random_item', 'assets2/random_item.png', {
      frameWidth: 320,
      frameHeight: 96,
    })
    this.load.spritesheet('office', 'assets2/office.png', {
      frameWidth: 320,
      frameHeight: 160,
    })
    this.load.spritesheet('npc', 'assets2/npc.png', {
      frameWidth: 160,
      frameHeight: 96,
    })
    // this.load.spritesheet('chairs', 'assets/items/chair.png', {
    //   frameWidth: 32,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('computers', 'assets/items/computer.png', {
    //   frameWidth: 96,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('whiteboards', 'assets/items/whiteboard.png', {
    //   frameWidth: 64,
    //   frameHeight: 64,
    // })
    // this.load.spritesheet('vendingmachines', 'assets/items/vendingmachine.png', {
    //   frameWidth: 48,
    //   frameHeight: 72,
    // })
    // this.load.spritesheet('office', 'assets/tileset/Modern_Office_Black_Shadow.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
    // this.load.spritesheet('basement', 'assets/tileset/Basement.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
    // this.load.spritesheet('generic', 'assets/tileset/Generic.png', {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // })
    this.load.spritesheet('adam', 'assets/character/adam.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('ash', 'assets/character/ash.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('lucy', 'assets/character/lucy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('nancy', 'assets/character/nancy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.on('complete', () => {
      this.preloadComplete = true
      this.launchBackground(store.getState().user.backgroundMode)
    })
  }

  init() {
    this.network = new Network()
  }

  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode })
  }

  launchGame() {
    if (!this.preloadComplete) return
    this.network.webRTC?.checkPreviousPermission()
    this.scene.launch('game', {
      network: this.network,
    })

    // update Redux state
    store.dispatch(setRoomJoined(true))
  }

  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
}
