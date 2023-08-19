<template>
  <v-container fluid>
    <v-row class="mt-5">
      <v-col cols="12">
        <form>
          <v-text-field
            v-model="state.channel"
            label="room name"
            required
          ></v-text-field>
          <v-btn class="me-4" color="info" @click="register"> register </v-btn>
        </form>
      </v-col>
      <v-col cols="12" v-if="link_SUBSCRIBER">
        <div>
          <span>link SUBSCRIBER:</span>
          <a target="_blank" :href="link_SUBSCRIBER">{{ link_SUBSCRIBER }}</a>
        </div>
        <div>
          <span> link PUBLISHER: </span>
          <a target="_blank" :href="link_PUBLISHER">{{ link_PUBLISHER }}</a>
        </div>
      </v-col>
    </v-row>
  </v-container>
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
        this.link_PUBLISHER =
          process.env.BASE_URL +
          `/live/publisher?channel=${this.state.channel}&uid=${this.state.uid}`;
        this.link_SUBSCRIBER =
          process.env.BASE_URL +
          `/live/subscriber?channel=${this.state.channel}&uid=${this.state.uid}`;
      }
    },
  },
};
</script>
