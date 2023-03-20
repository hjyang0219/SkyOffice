import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

interface BookshelfState {
  bookshelfDialogOpen: boolean
  bookshelfId: null | string
  bookshelfUrl: null | string
  urls: Map<string, string>
}

const initialState: BookshelfState = {
  bookshelfDialogOpen: false,
  bookshelfId: null,
  bookshelfUrl: null,
  urls: new Map(),
}

export const bookshelfSlice = createSlice({
  name: 'bookshelf',
  initialState,
  reducers: {
    openBookshelfDialog: (state, action: PayloadAction<string>) => {
      state.bookshelfDialogOpen = true
      state.bookshelfId = action.payload
      const url = state.urls.get(action.payload)
      if (url) state.bookshelfUrl = url
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
    },
    closeBookshelfDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      // game.network.disconnectFromBookshelf(state.bookshelfId!)
      state.bookshelfDialogOpen = false
      state.bookshelfId = null
      state.bookshelfUrl = null
    },
    setBookshelfUrls: (state, action: PayloadAction<{ bookshelfId: string; roomId: string }>) => {
      state.urls.set(
        action.payload.bookshelfId,
        `https://wbo.ophir.dev/boards/sky-office-${action.payload.roomId}`
      )
    },
  },
})

export const { openBookshelfDialog, closeBookshelfDialog, setBookshelfUrls } =
  bookshelfSlice.actions

export default bookshelfSlice.reducer
