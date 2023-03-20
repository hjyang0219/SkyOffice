import { ItemType } from '../../../types/Items'
import store from '../stores'
import Item from './Item'
import Network from '../services/Network'
import { openBookshelfDialog } from '../stores/BookshelfStore'

export default class BookshelfFashion extends Item {
  id?: string
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.BOOKSHELF_FASHION
  }

  onOverlapDialog() {
    this.setDialogBox('Press R to use Bookshelf')
  }
  openDialog(network: Network) {
    if (!this.id) return
    store.dispatch(openBookshelfDialog(this.id))
    network.connectToWhiteboard(this.id)
  }
}
