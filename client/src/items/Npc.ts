import { ItemType } from '../../../types/Items'
import store from '../stores'
import { openNPCDialog,setFocused } from '../stores/NPCStore'
import Item from './Item'

export default class Npc extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    this.itemType = ItemType.NPC
  }

  onOverlapDialog() {
    this.setDialogBox('Press R to chat with the librarian')
  }
  openDialog() {
    store.dispatch(openNPCDialog())  
    store.dispatch(setFocused(true))
  }
}
