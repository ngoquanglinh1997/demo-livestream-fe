import AgoraRTC from 'agora-rtc-sdk-ng';

const logger = console.log;

export class AgoraBase {
  video;
  client;
  uid;
  channel;
  orders;

  constructor(options, video) {
    this.video = video;
    this.options = options;
    AgoraRTC.enableLogUpload();
    AgoraRTC.setLogLevel(0);

    // https://docs.agora.io/en/faqs/API%20Reference/web/interfaces/agorartc.clientconfig.html
    this.client = AgoraRTC.createClient({
      mode: 'live',
      codec: 'vp8', // vp8 | vp9 | h264
    });
  }
}

export class AgoraPublisher extends AgoraBase {
  idPrefix = 'p';
  videoTrack;
  audioTrack;
  isFrontCamera = false;
  constraints = {
    video: {
      facingMode: 'environment',
    },
    audio: true,
  };

  async startPublisher() {
    // https://docs.agora.io/en/live-streaming/start_live_web_ng?platform=Web#3-join-a-channel
    await this.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);

    //  host or audience
    this.client.setClientRole('host');

    logger('createMicrophoneAndCameraTracks');
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(undefined, {
      facingMode: this.constraints.video.facingMode,
      // https://docs.agora.io/en/live-streaming/video_profile_web_ng?platform=Web
      encoderConfig: "1080p",

    });
    this.videoTrack = cameraTrack;
    this.audioTrack = microphoneTrack;

    logger('microphoneTrack label: ', this.videoTrack.getTrackLabel());
    logger('cameraTrack label: ', this.videoTrack.getTrackLabel());

    await this.client.publish([this.audioTrack, this.videoTrack]);
    logger('this.client after: ', this.client.localTracks);

    // note : microphoneTrack.play()
    this.videoTrack.play(this.video);

    return [this.audioTrack.getTrackLabel(), this.videoTrack.getTrackLabel()];
  }

  async stop() {
    logger('finish publisher');
    if (this.videoTrack) {
      await this.videoTrack.close();
    }
    if (this.audioTrack) {
      await this.audioTrack.close();
    }
    await this.client.unpublish();
    await this.client.leave();
  }

  async listener() {
    logger('listener');
    // event user joins room
    await this.client.on('user-published', async (user, mediaType) => {
      logger('start : ', mediaType);
      await this.client.subscribe(user, mediaType);

      if (mediaType === 'video') {
        user.videoTrack.play(this.video);
      }

      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    // event user leaves room
    await this.client.on('user-unpublished', async (user, mediaType) => {
      logger('end : ', mediaType);
      if (this.client) {
        await this.client.unsubscribe(user, mediaType);
      }
    });
  }
}

export class AgoraSubscriber extends AgoraBase {
  idPrefix = 's';
  async startSubscriberOnce() {
    // https://docs.agora.io/en/live-streaming/start_live_web_ng?platform=Web#3-join-a-channel
    await this.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);

    logger('startSubscriberOnce');
    // host or audience
    this.client.setClientRole('audience');

    await this.client.on('user-published', async (user, mediaType) => {
      logger('start : ', mediaType);
      await this.client.subscribe(user, mediaType);

      if (mediaType === 'video') {
        user.videoTrack.play(this.video);
      }

      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    await this.client.on('user-unpublished', async (user, mediaType) => {
      logger('end : ', mediaType);
      if (this.client) {
        await this.client.unsubscribe(user, mediaType);
      }
    });
  }

  async stop() {
    logger('finish Subscriber');
    if (this.client) {
      await this.client.leave();
    }
  }
}
