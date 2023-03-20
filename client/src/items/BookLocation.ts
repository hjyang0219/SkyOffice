import { ItemType } from '../../../types/Items'
import store from '../stores'
import { openBooklocationDialog } from '../stores/BooklocationStore'
import Item from './Item'

export default class BookLocation extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.BOOKLOCATION
  }

  onOverlapDialog() {
    this.setDialogBox('Press R to use Book location')
  }
  openDialog() {
    store.dispatch(openBooklocationDialog())  
  }
}
