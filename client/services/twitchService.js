'use strict';

export default class twitchService {
    constructor($http)  {
        this.$http = $http;
        // basic twitch api url
        this.url = 'https://api.twitch.tv/kraken/';

        this.results = [];
        this.channels = [];
        this.tempChannels = [];
    }


    init(channels) {
        this.channels = channels;
    }
    // method to fetch live streams
    getLiveStreams(channelsList) {
        return this.$http.get(this.formStreamsRequestUrl(channelsList),
            {
                headers: {'Accept': 'application/vnd.twitchtv.v3+json'}
            }
        );
    }
    // method to fetch one channel
    getOfflineChannel(channelName) {
        return this.$http.get(this.url + 'channels/' + channelName,
            {
                headers: {'Accept': 'application/vnd.twitchtv.v3+json'}
            }
        );
    }

    // form proper request url
    formStreamsRequestUrl(channelsList) {
        return this.url + 'streams?channel=' + channelsList.join();
    }

    // remove item from channels array
    removeFromChannels(item) {
        let indexToRemove = this.channels.indexOf(item);
        this.channels.splice(indexToRemove, 1);
    }


    // get all data
    getData() {

        let vm = this;

        return vm.getLiveStreams(vm.channels)
            .then(getLiveStreamsCb);

        function getLiveStreamsCb(res) {
            // if live streams in response
            if (res.data._total > 0) {
                // add their data to results
                res.data.streams.forEach((stream) => {
                    vm.results.push({
                        name: stream.channel.display_name,
                        status: 'Online',
                        streamName: stream.channel.status,
                        url: stream.channel.url
                    });

                    // delete active streams from temp variable

                    vm.removeFromChannels(stream.channel.display_name);

                });
            }



            vm.channels.forEach((channelName) => {
                getOfflineStreamErrCb.bind(channelName);
                vm.getOfflineChannel(channelName)
                    .then(getOfflineStreamCb)
                    .catch((err) => {
                        getOfflineStreamErrCb(err, channelName);
                    });
            });

            return vm.results;
        }

        function getOfflineStreamCb(res) {
            vm.results.push({
                name: res.data.display_name,
                status: 'Offline',
                streamName: '',
                url: res.data.url
            });

            vm.removeFromChannels(res.data.display_name);
        }
        function getOfflineStreamErrCb(err, channelName) {
            // vm status code means that channel deleted
            if (err.status !== 422) {
                return console.error(err);
            }

            vm.results.push({
                name: channelName,
                status: 'Account deleted',
                streamName: '',
                url: undefined
            });

            vm.removeFromChannels(channelName);
        }

    }
}

twitchService.$inject = ['$http'];