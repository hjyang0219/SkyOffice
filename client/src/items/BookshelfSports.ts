import { ItemType } from '../../../types/Items'
import Item from './Item'

export default class BookshelfSports extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.BOOKSHELF_SPORTS
  }

  onOverlapDialog() {
    this.setDialogBox('Press R to use Bookshelf')
  }
}
