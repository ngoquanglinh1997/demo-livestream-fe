<template>
  <div class="container">
    <div class="mt-5" style="margin-top: 100px">
      <div>
        <div class="input-group">
          <input v-model="state.channel" label="room name" required />
        </div>
        <button class="me-4" color="info" @click="register">create room</button>
      </div>
      <div cols="12" v-if="link_SUBSCRIBER" style="margin-top: 10px">
        <div>
          <span>link SUBSCRIBER:</span>
          <nuxt-link :to="link_SUBSCRIBER" target="_blank">{{
            link_SUBSCRIBER
          }}</nuxt-link>
        </div>
        <div>
          <span> link PUBLISHER: </span>
          <nuxt-link :to="link_PUBLISHER" target="_blank">{{
            link_PUBLISHER
          }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      state: {
        channel: "",
        uid: uuidv4(),
      },
      link_SUBSCRIBER: "",
      link_PUBLISHER: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.chatMessages.push({ text: `You: ${this.newMessage}` });
        this.newMessage = "";
      }
    },

    async register() {
      if (this.state.channel.trim() != "") {
        this.link_PUBLISHER = `/live/publisher?channel=${this.state.channel}`;
        this.link_SUBSCRIBER = `/live/subscriber?channel=${this.state.channel}`;
      }
    },
  },
};
</script>
