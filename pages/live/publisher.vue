<template>
  <div class="live-page">
    <div
      class="video-container p-deliver-video-container"
      id="p-deliver-video-container"
    >
      <video id="publisher-stream-video" ref="video" controls></video>

      <h2></h2>
      <div class="video-overlay">
        <div class="d-flex j-between">
          <div class="d-flex j-around">
            <button
              color="info"
              size="x-large"
              class="video-btn"
              @click="start"
            >
              start
            </button>
          </div>
          <button
            color="error"
            size="x-large"
            class="video-btn error"
            @click="stop"
          >
            stop
          </button>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar-container">
        <div style="height: 100%">
          <h2>Live Chat</h2>
          <ul class="chat-messages">
            <li v-for="(message, index) in messages" :key="index">
              {{ message.message }}
            </li>
          </ul>
        </div>
        <div>
          <input
            type="text"
            v-model="message"
            placeholder="message..."
            @keyup.enter="submit"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AgoraPublisher } from "~/plugins/agora.js";
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      messages: [],
      message: "",
      client: null,
      userId: uuidv4(),
    };
  },
  async mounted() {
    await this.fetchData();
    this.socket = this.$nuxtSocket({
      name: "main",
    });

    /* Listen for events: */
    this.socket.on("send-message", (msg, cb) => {
      if (msg.userId != this.userId) {
        this.messages = [...this.messages, msg];
      }
    });
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    async fetchData() {
      try {
        const { query } = this.$nuxt.context.route;
        if (!query.channel) {
          return;
        }
        const model = {
          channel: query.channel,
          uid: this.userId,
        };
        const { data } = await this.$axios.post("/live/publisher", model);
        await this.initAgora(data);
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async initAgora(data) {
      //this.agora = new AgoraRTCManager(data);
      this.client = new AgoraPublisher(data, this.$refs.video);
      await this.client.listener();
    },
    async start() {
      await this.client.startPublisher();
    },
    stop() {
      this.client.stop();
    },
    async submit() {
      if (this.message) {
        const model = { userId: this.userId, message: this.message };
        const { data } = await this.$axios.post("/live/chat", model);
        this.messages = [...this.messages, data];
        this.message = "";
      }
    },
  },
};
</script>

