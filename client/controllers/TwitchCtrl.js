'use strict';

/*

    Main app class

*/

export default class TwitchCtrl {
    constructor(twitchService, $window) {
        // deps
        this.twitchService = twitchService;
        this.$window = $window;

        this.title = 'TwitchApp';
        // channel list
        this.channels = ['ESL_SC2', 'OgamingSC2', 'FreeCodeCamp', 'RobotCaleb', 'brunofin', 'comster404', 'Dread'];
        // here we store results
        this.results = [];
        // search field value
        this.search = '';
        // radiobuttons value
        this.filterRadio = {};
        this.filterRadio.status = '';

        // activate on load
        this.activate();
    }
    //   Activates controller to get data
    activate() {

        this.results = [];

        this.twitchService.init(this.channels);

        this.twitchService.getData()
            .then((results) => {
                this.results = results;
            });

    }
    // open link in new tab
    openChannel(url) {
        if (!url) {
            return;
        }

        this.$window.open(url, '_blank');
    }
}

TwitchCtrl.$inject = ['twitchService', '$window'];