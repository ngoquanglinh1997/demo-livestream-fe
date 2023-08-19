<template>
  <div class="live-page">
    <div class="video-container">
      <video id="publisher-stream-video" controls></video>
      <video id="remote-video" controls></video>

      <h2>Your browser does not support the video tag.</h2>
      <div class="video-overlay">
        <div class="d-flex justify-space-between align-center">
          <div>
            <v-btn color="info" size="x-large" class="video-btn" @click="start">
              start
            </v-btn>
            <v-btn color="warning" size="x-large" class="video-btn">
              pause
            </v-btn>
          </div>

          <v-btn color="error" size="x-large" class="video-btn"> stop </v-btn>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar-container">
        <div>
          <h2>Live Chat</h2>
          <ul class="chat-messages">
            <li v-for="(message, index) in chatMessages" :key="index">
              {{ message.text }}
            </li>
          </ul>
        </div>
        <div>
          <v-text-field
            label="send a message..."
            variant="outlined"
            :hide-details="true"
            :autofocus="true"
            :rows="2"
          ></v-text-field>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AgoraRTCManager from "~/plugins/agora.js";

export default {
  data() {
    return {
      streamSource: "https://youtu.be/WdZgjWbsPLI",
      chatMessages: [
        { text: "User1: Hello, everyone!" },
        { text: "User2: Hey there!" },
        { text: "User3: How's it going?" },
      ],
      newMessage: "",
      agora: null,
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const { query } = this.$nuxt.context.route;
        if (!query.channel || !query.uid) {
          return;
        }
        const model = {
          channel: query.channel,
          uid: query.uid,
        };
        const { data } = await this.$axios.post("/subscriber", model);
        await this.initAgora(data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.chatMessages.push({ text: `You: ${this.newMessage}` });
        this.newMessage = "";
        this.$socket.emit("message", "Hello, Socket.io!");
      }
    },
    async initAgora(data) {
      if (!this.agora) {
        this.agora = new AgoraRTCManager(data);
      }
    },
    start() {
      this.agora.start();
    },
  },
};
</script>

