import AgoraRTC from 'agora-rtc-sdk';

export default class AgoraRTCManager {
    options =
        {
            appId: '',
            channel: '',
            token: '',
            uid: 0,
            role: ''
        };
    channelParameters =
        {
            // A variable to hold a local audio track.
            localAudioTrack: null,
            // A variable to hold a local video track.
            localVideoTrack: null,
            // A variable to hold a remote audio track.
            remoteAudioTrack: null,
            // A variable to hold a remote video track.
            remoteVideoTrack: null,
            // A variable to hold the remote user id.s
            remoteUid: null,
        };

    constructor(options) {
        this.options = options;

        this.agoraEngine = AgoraRTC.createClient({ mode: "live", codec: "vp9" });
        // Dynamically create a container in the form of a DIV element to play the remote video track.
        this.remotePlayerContainer = document.createElement("div");
        // Dynamically create a container in the form of a DIV element to play the local video track.
        this.localPlayerContainer = document.createElement('div');
        // Specify the ID of the DIV container. You can use the uid of the local user.
        this.localPlayerContainer.id = options.uid;
        // Set the textContent property of the local video container to the local user id.
        this.localPlayerContainer.textContent = "Local user " + this.options.uid;
        // Set the local video container size.
        this.localPlayerContainer.style.width = "640px";
        this.localPlayerContainer.style.height = "480px";
        this.localPlayerContainer.style.padding = "15px 5px 5px 5px";
        // Set the remote video container size.
        this.remotePlayerContainer.style.width = "640px";
        this.remotePlayerContainer.style.height = "480px";
        this.remotePlayerContainer.style.padding = "15px 5px 5px 5px";

        this.agoraEngine.on("user-published", async (user, mediaType) => {
            console.log(user, "1111111111111111111111111111");
            // Subscribe to the remote user when the SDK triggers the "user-published" event.
            await agoraEngine.subscribe(user, mediaType);
            console.log("subscribe success");
            // Subscribe and play the remote video in the container If the remote user publishes a video track.
            if (mediaType == "video") {
                // Retrieve the remote video track.
                this.channelParameters.remoteVideoTrack = user.videoTrack;
                // Retrieve the remote audio track.
                this.channelParameters.remoteAudioTrack = user.audioTrack;
                // Save the remote user id for reuse.
                this.channelParameters.remoteUid = user.uid.toString();
                // Specify the ID of the DIV container. You can use the uid of the remote user.
                this.remotePlayerContainer.id = user.uid.toString();
                this.channelParameters.remoteUid = user.uid.toString();
                this.remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
                // Append the remote container to the page body.
                document.body.append(this.remotePlayerContainer);
                if (this.options.role != 'host') {
                    // Play the remote video track.
                    this.channelParameters.remoteVideoTrack.play(this.remotePlayerContainer);
                }
            }
            // Subscribe and play the remote audio track If the remote user publishes the audio track only.
            if (mediaType == "audio") {
                // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
                this.channelParameters.remoteAudioTrack = user.audioTrack;
                // Play the remote audio track. No need to pass any DOM element.
                this.channelParameters.remoteAudioTrack.play();
            }
            // Listen for the "user-unpublished" event.
            this.agoraEngine.on("user-unpublished", user => {
                console.log(user.uid + "has left the channel");
            });
        });

        AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);
    }

    async start() {
        if (this.options.role == "host") {
            // Save the selected role in a variable for reuse.
            // Call the method to set the role as Host.
            await this.agoraEngine.setClientRole(this.options.role);
            if (this.channelParameters.localVideoTrack != null) {
                // Publish the local audio and video track in the channel.
                await this.agoraEngine.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
                // Stop playing the remote video.
                this.channelParameters.remoteVideoTrack.stop();
                // Start playing the local video.
                this.channelParameters.localVideoTrack.play(this.localPlayerContainer);
            }
        } else {
            // Save the selected role in a variable for reuse.
            if (this.channelParameters.localAudioTrack != null && this.channelParameters.localVideoTrack != null) {
                if (this.channelParameters.remoteVideoTrack != null) {
                    // Replace the current video track with remote video track
                    await this.channelParamaters.localVideoTrack.replaceTrack(this.channelParamaters.remoteVideoTrack, true);
                }
            }
            // Call the method to set the role as Audience.
            await this.agoraEngine.setClientRole(this.options.role);
        }
        console.log("xuong day", this.options);
        // Join a channel.
        await this.agoraEngine.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
        console.log("xuong day 1");
        // Create a local audio track from the audio sampled by a microphone.
        try {
            this.channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        } catch {
        }

        try {
            // Create a local video track from the video captured by a camera.
            this.channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        } catch {
        }
        console.log("xuong day 2");

        console.log("xuong day 3");
        // Append the local video container to the page body.
        document.body.append(this.localPlayerContainer);
        console.log("xuong day 4");
        // Publish the local audio and video track if the user joins as a host.
        if (this.options.role == 'host') {
            console.log("xuong day 5");
            // Publish the local audio and video tracks in the channel.
            await this.agoraEngine.publish([this.channelParameters.localAudioTrack, this.channelParameters.localVideoTrack]);
            // Play the local video track.
            this.channelParameters.localVideoTrack.play(this.localPlayerContainer);
            console.log("publish success!");
        }
    }

    async stop() {
        // Destroy the local audio and video tracks.
        this.channelParameters.localAudioTrack.close();
        this.channelParameters.localVideoTrack.close();
        // Remove the containers you created for the local video and remote video.
        this.removeVideoDiv(this.remotePlayerContainer.id);
        this.removeVideoDiv(this.localPlayerContainer.id);
        // Leave the channel
        await agoraEngine.leave();
    }
    removeVideoDiv(elementId) {
        console.log("Removing " + elementId + "Div");
        let Div = document.getElementById(elementId);
        if (Div) {
            Div.remove();
        }
    };
}