import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { IOfficeState } from '../../../types/IOfficeState'
import { ChatMessage } from '../schema/OfficeState'
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

type Payload = {
  client: Client
  content: string
}

export default class GPTChatMessageUpdateCommand extends Command<IOfficeState, Payload>  {
  async execute(data: Payload) {
    const { client, content } = data
    const player = this.room.state.players.get(client.sessionId)
    const chatMessages = this.room.state.chatMessages

    if (!chatMessages) return
    if (!player) return

    var messages = [
      {
        role:"system", content:"당신은 도서관 사서 입니다. 당신에게 불가능 한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 Librarian 입니다. 당신은 사람에게 아주 명확하게 도서를 추천할 수 있고 책에 대한 정보를 답으로 줄 수 있습니다. 책 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신을 통해 도서대여는 불가능하며 당신은 추천이나 정보만 제공할 수 있습니다. 당신이 있는 공간은 쏠닷 라이브러리 메타버스 입니다. 쏠닷 라이브러리는 오프라인 방문을 통해서 도서를 대출할 수 있습니다. 이 곳에서 소장하고 있는 도서는 6가지로 분류 되어 있습니다. 각 분류는 Fashion, Gourmet, Shelter, Mobility, Art, Sports 입니다. 오프라인 도서관의 위치는 서울 서대문구 경기대로11길 26-6 1층이며 서대문역에서 도보 5분 거리에 있습니다. 도서의 자세한 위치는 당신의 왼쪽에 위치한 컴퓨터에서 확인 할 수 있습니다."
      },
      {
        role: "user", content: "당신은 도서관 사서 입니다. 당신에게 불가능 한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 Librarian 입니다. 당신은 사람에게 아주 명확하게 도서를 추천할 수 있고 책에 대한 정보를 답으로 줄 수 있습니다. 책 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다. 당신을 통해 도서대여는 불가능하며 당신은 추천이나 정보만 제공할 수 있습니다. 당신이 있는 공간은 쏠닷 라이브러리 메타버스 입니다. 쏠닷 라이브러리는 오프라인 방문을 통해서 도서를 대출할 수 있습니다. 이 곳에서 소장하고 있는 도서는 6가지로 분류 되어 있습니다. 각 분류는 Fashion, Gourmet, Shelter, Mobility, Art, Sports 입니다. 오프라인 도서관의 위치는 서울 서대문구 경기대로11길 26-6 1층이며 서대문역에서 도보 5분 거리에 있습니다. 도서의 자세한 위치는 당신의 왼쪽에 위치한 컴퓨터에서 확인 할 수 있습니다."
      },
      {
        role: "assistant",content: "안녕하세요! 도서관 사서 Librarian입니다. 무엇을 도와 드릴까요?"
      },
      {
        role: "user", content: content
      }
    ]

    /**
     * Only allow server to store a maximum of 100 chat messages:
     * remove the first element before pushing a new one when array length is >= 100
     */
    if (chatMessages.length >= 99) chatMessages.shift()

    const newMessage = new ChatMessage()
    newMessage.author = player.name
    newMessage.content = content
    chatMessages.push(newMessage)
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.5,
      max_tokens: 2048
    });
    // console.log(completion.data.choices[0].message);

    const newGPTMessage = new ChatMessage()
    newGPTMessage.author = "Librarian"
    newGPTMessage.content = completion.data.choices[0].message.content
    chatMessages.push(newGPTMessage)
  }
}
