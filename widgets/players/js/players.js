/*
    ioBroker.vis players-widgets Widget-Set

    version: "0.0.1"

    Copyright 10.2015-2016 instalator<vvvalt@mail.ru>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor":          {"en": "myColor",       "de": "mainColor",  "ru": "Мой цвет"},
        "myColor_tooltip":  {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText":         {"en": "htmlText",      "de": "htmlText",   "ru": "htmlText"},
        "group_extraMyset": {"en": "extraMyset",    "de": "extraMyset", "ru": "extraMyset"},
        "extraAttr":        {"en": "extraAttr",     "de": "extraAttr",  "ru": "extraAttr"}
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance":  {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

// this code can be placed directly in players.html
vis.binds.players = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds.players.version) {
            console.log('Version players: ' + vis.binds.players.version);
            vis.binds.players.version = null;
        }
    },
    states: {
        oid_play:   {val: undefined, selector: '', blink: false, objName: 'play'},
        oid_next:   {val: undefined, selector: '', blink: false, objName: 'next'},
        oid_prev:   {val: undefined, selector: '', blink: false, objName: ''},
        oid_stop:   {val: undefined, selector: '', blink: false, objName: ''},
        oid_pause:  {val: undefined, selector: '', blink: false, objName: ''},
        oid_seek:   {val: 0,         selector: '', blink: false, objName: ''},
        oid_vol:    {val: 0,         selector: '', blink: false, objName: ''},
        oid_mute:   {val: undefined, selector: '', blink: false, objName: ''},
        oid_random: {val: undefined, selector: '', blink: false, objName: ''},
        oid_repeat: {val: undefined, selector: '', blink: false, objName: ''},
        oid_artist: {val: '', selector: '', blink: false, objName: ''},
        oid_title:  {val: '', selector: '', blink: false, objName: ''},
        oid_album:  {val: '', selector: '', blink: false, objName: ''},
        oid_bitrate:{val: '', selector: '', blink: false, objName: ''}
    },
    
    createWidgetWinampPlayer: function (widgetID, view, data, style) { //tplWinampPlayer
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.players.createWidgetWinampPlayer(widgetID, view, data, style);
            }, 100);
        }

        function updateStates() {
            var states = JSON.parse(JSON.stringify(vis.binds.players.states));
            for (var s in states) {
                if( states.hasOwnProperty(s)){
                    if (data[s] && data[s] !== 'nothing_selected') { states[s].val = vis.states[data[s] + '.val']; }
                }
            }
            $('.winamp-artist').text('Artist: ' + states.oid_artist.val);
            $('.winamp-title').text('Title: ' + states.oid_title.val);
            $('.winamp-album').text('Album: ' + states.oid_album.val);
            $('.winamp-bitrate').text('kbps: ' + states.oid_bitrate.val);

            if(states.oid_repeat.val > 0){
                $('.winamp-repeat').css("display","block");
            } else {
                $('.winamp-repeat').css("display","none");
            }
            if(states.oid_random.val > 0){
                $('.winamp-random').css("display","block");
            } else {
                $('.winamp-random').css("display","none");
            }

            $(function() {
                var slider = $('#winamp-vol_slider');
                slider.slider({
                    range: "min",
                    min: 0,
                    value: states.oid_vol.val,
                    start: function(event,ui) {
                    },
                    slide: function(event, ui) {
                        var value = slider.slider('value');
                        vis.setValue(data.oid_vol, value);
                    },
                    stop: function(event,ui) {

                    }
                });

            });
            $(function() {
                var slider = $('#winamp-seek_slider');
                slider.slider({
                    range: "min",
                    min: 0,
                    value: states.oid_seek.val,
                    start: function(event,ui) {

                    },
                    slide: function(event, ui) {
                        var value = slider.slider('value');
                        vis.setValue(data.oid_seek, value);
                    },
                    stop: function(event,ui) {
                    }
                });
            });
        }
        $(".winamp-btn").on("click", function(e){
            e.preventDefault();
            if (e.target.id === 'mute'){
                if (data.oid_mute.val === 0 || data.oid_mute.val === false){
                    vis.setValue(data.oid_mute, false);
                    updateStates();
                } else {
                    vis.setValue(data.oid_mute, true);
                    updateStates();
                }
            }
        });

        //debugger;
        // subscribe on updates of values
        for (var s in vis.binds.players.states) {
            if (!data[s] || data[s] == 'nothing_selected') continue;
            vis.states.bind(data[s] + '.val', function () {
                updateStates();
            });
        }
        // initial update
        updateStates();
    }
};
	
vis.binds.players.showVersion();
