import React, { useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

import { getColorByString } from '../util'
import { MessageType, setFocused, closeNPCDialog } from '../stores/NPCStore'
import { useAppDispatch, useAppSelector } from '../hooks'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 16px 180px 16px 16px;
  max-width: 100%;
  max-height: 100%;
`
const Wrapper = styled.div`
  height: 100%;
  background: #222639;
  border-radius: 16px;
  padding: 16px;
  color: #eee;
  position: relative;
  display: flex;
  flex-direction: column;
  .close {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`


const ChatHeader = styled.div`
  position: relative;
  height: 35px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  h3 {
    color: #fff;
    margin: 7px;
    font-size: 17px;
    text-align: center;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
  margin-right: 25px;
`

const ChatBox = styled(Box)`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  margin-right: 25px;
`

const MessageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0px 2px;

  p {
    margin: 3px;
    text-shadow: 0.3px 0.3px black;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  span {
    color: white;
    font-weight: normal;
  }

  .notification {
    color: grey;
    font-weight: normal;
  }

  :hover {
    background: #3a3a3a;
  }
  margin-right: 25px;
`

const InputWrapper = styled.form`
  box-shadow: 10px 10px 10px #00000018;
  border: 1px solid #42eacb;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  flex-direction: row;
  background: linear-gradient(180deg, #000000c1, #242424c0);
  margin-right: 25px;
`

const InputTextField = styled(InputBase)`
  border-radius: 0px 0px 10px 10px;
  input {
    padding: 5px;
  }
  margin-right: 25px;
`

const dateFormatter = new Intl.DateTimeFormat('en', {
  timeStyle: 'short',
  dateStyle: 'short',
})

const Message = ({ chatMessage, messageType }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  return (
    <MessageWrapper
      onMouseEnter={() => {
        setTooltipOpen(true)
      }}
      onMouseLeave={() => {
        setTooltipOpen(false)
      }}
    >
      <Tooltip
        open={tooltipOpen}
        title={dateFormatter.format(chatMessage.createdAt)}
        placement="right"
        arrow
      >
        {messageType === MessageType.REGULAR_MESSAGE ? (
          <p
            style={{
              color: getColorByString(chatMessage.author),
            }}
          >
            {chatMessage.author}:<span>{chatMessage.content}</span>
          </p>
        ) : (
          <p className="notification">
            {chatMessage.author} {chatMessage.content}
          </p>
        )}
      </Tooltip>
    </MessageWrapper>
  )
}
export default function NPCDialog() {
  // const whiteboardUrl = useAppSelector((state) => state.whiteboard.whiteboardUrl)
  
  const [inputValue, setInputValue] = useState('')
  const [readyToSubmit, setReadyToSubmit] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.npc.chatMessages)
  const focused = useAppSelector((state) => state.npc.focused)
  const showChat = useAppSelector((state) => state.npc.showChat)
  const dispatch = useAppDispatch()
  const game = phaserGame.scene.keys.game as Game

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      // move focus back to the game
      inputRef.current?.blur()
      dispatch(setFocused(false))
      dispatch(closeNPCDialog())

    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // this is added because without this, 2 things happen at the same
    // time when Enter is pressed, (1) the inputRef gets focus (from
    // useEffect) and (2) the form gets submitted (right after the input
    // gets focused)
    if (!readyToSubmit) {
      setReadyToSubmit(true)
      return
    }
    // move focus back to the game
    inputRef.current?.blur()

    const val = inputValue.trim()
    setInputValue('')
    if (val) {
      game.network.addGPTChatMessage(chatMessages, val)
      // game.myPlayer.updateDialogBubble(val)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showChat])


  return (
    <Backdrop>
      <Wrapper>
        <IconButton
          aria-label="close dialog"
          className="close"
          onClick={() => dispatch(closeNPCDialog())}
        >
          <CloseIcon />
        </IconButton>
          <ChatHeader>
            <h3>Librarian</h3>
          </ChatHeader>
          <ChatBox>
            {chatMessages.map(({ messageType, chatMessage }, index) => (
              <Message chatMessage={chatMessage} messageType={messageType} key={index} />
            ))}
            <div ref={messagesEndRef} />
          </ChatBox>
          <InputWrapper onSubmit={handleSubmit}>
            <InputTextField
              inputRef={inputRef}
              autoFocus={focused}
              fullWidth
              placeholder="Press Enter to chat"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onFocus={() => {
                if (!focused) {
                  dispatch(setFocused(true))
                  setReadyToSubmit(true)
                }
              }}
              onBlur={() => {
                dispatch(setFocused(false))
                setReadyToSubmit(false)
              }}
            />
          </InputWrapper>
      </Wrapper>
    </Backdrop>
  )
}
