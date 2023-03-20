import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface BooklocationState {
  booklocationDialogOpen: boolean
}

const initialState: BooklocationState = {
  booklocationDialogOpen: false,
}

export const booklocationSlice = createSlice({
  name: 'booklocation',
  initialState,
  reducers: {
    openBooklocationDialog: (state) => {
      state.booklocationDialogOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeBooklocationDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.booklocationDialogOpen = false
      
    }
  },
})

export const { openBooklocationDialog, closeBooklocationDialog } =
  booklocationSlice.actions

export default booklocationSlice.reducer
