import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IChatMessage } from '../../../types/IOfficeState'
import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

export enum MessageType {
  PLAYER_JOINED,
  PLAYER_LEFT,
  REGULAR_MESSAGE,
}

interface NPCState {
  npcDialogOpen: boolean,
  chatMessages: Array<{ messageType: MessageType; chatMessage: IChatMessage }>,
  focused: boolean,
  showChat: boolean,
}

const initialState: NPCState = {
  npcDialogOpen: false,
  chatMessages: new Array<{ messageType: MessageType; chatMessage: IChatMessage }>(),
  focused: true,
  showChat: true,
}

export const npcSlice = createSlice({
  name: 'npc',
  initialState,
  reducers: {
    openNPCDialog: (state) => {
      state.npcDialogOpen = true
      const game = phaserGame.scene.keys.game as Game
      game.disableKeys()
      state.chatMessages.push({
        messageType: MessageType.REGULAR_MESSAGE,
        chatMessage:{
          author: "Librarian",
          content: "안녕하세요! 도서관 사서 Librarian 입니다. 무엇을 도와 드릴까요?",
          createdAt: Date.now()
        }
      })
    },
    closeNPCDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.npcDialogOpen = false
      state.chatMessages = new Array<{ messageType: MessageType; chatMessage: IChatMessage }>()
    },
    pushGPTChatMessage: (state, action: PayloadAction<IChatMessage>) => {
      state.chatMessages.push({
        messageType: MessageType.REGULAR_MESSAGE,
        chatMessage: action.payload,
      })
    },
    setFocused: (state, action: PayloadAction<boolean>) => {
      const game = phaserGame.scene.keys.game as Game
      action.payload ? game.disableKeys() : game.enableKeys()
      state.focused = action.payload
    },
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload
    },
  },
})

export const { 
  openNPCDialog, 
  closeNPCDialog,
  pushGPTChatMessage,
  setFocused,
  setShowChat, } =
  npcSlice.actions

export default npcSlice.reducer
