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
        oid_play:    {val: undefined, selector: '', objName: 'play'},
        oid_next:    {val: undefined, selector: '', objName: 'next'},
        oid_prev:    {val: undefined, selector: '', objName: ''},
        oid_stop:    {val: undefined, selector: '', objName: ''},
        oid_pause:   {val: undefined, selector: '', objName: ''},
        oid_seek:    {val: 0,         selector: '', objName: ''},
        oid_vol:     {val: 0,         selector: '', objName: ''},
        oid_mute:    {val: undefined, selector: '', objName: ''},
        oid_shuffle: {val: undefined, selector: '', objName: ''},
        oid_repeat:  {val: undefined, selector: '', objName: ''},
        oid_artist:  {val: '',        selector: '', objName: ''},
        oid_title:   {val: '',        selector: '', objName: ''},
        oid_album:   {val: '',        selector: '', objName: ''},
        oid_bitrate: {val: '',        selector: '', objName: ''}
    },
    
    createWidgetWinampPlayer: function (widgetID, view, data, style) { //tplWinampPlayer
        var $div = $('#' + widgetID);
        var vol_slider = $('#winamp-vol_slider');
        var seek_slider = $('#winamp-seek_slider');
        var states = {};
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.players.createWidgetWinampPlayer(widgetID, view, data, style);
            }, 100);
        }
        $(function() {
            //var vol_slider = $('#winamp-vol_slider');
            vol_slider.slider({
                range: "min",
                min: 0,
                value: vis.states['data.oid_vol.val'],//states.oid_vol.val,
                start: function(event,ui) {
                },
                slide: function(event, ui) {
                    //console.log(ui);
                    //var value = vol_slider.slider('value');
                    vis.setValue(data.oid_vol, ui.value);
                },
                stop: function(event,ui) {

                }
            });

        /*});
        $(function() {*/
           // var seek_slider = $('#winamp-seek_slider');
            seek_slider.slider({
                range: "min",
                min: 0,
                max: 100,
                value: 0,//states.oid_seek.val,
                start: function(event,ui) {

                },
                slide: function(event, ui) {
                    //console.log(ui.value);
                    vis.setValue(data.oid_seek, ui.value);
                },
                stop: function(event,ui) {
                }
            });
        });
        function updateStates() {
            states = JSON.parse(JSON.stringify(vis.binds.players.states));
            for (var s in states) {
                if( states.hasOwnProperty(s)){
                    if (data[s] && data[s] !== 'nothing_selected') { states[s].val = vis.states[data[s] + '.val']; }
                }
            }
            $('.winamp-artist').text('Artist: ' + states.oid_artist.val);
            $('.winamp-title').text('Title: ' + states.oid_title.val);
            $('.winamp-album').text('Album: ' + states.oid_album.val);
            $('.winamp-bitrate').text('kbps: ' + states.oid_bitrate.val);

            if(states.oid_repeat.val){
                $('.winamp-repeat').css("display","block");
            } else {
                $('.winamp-repeat').css("display","none");
            }
            if(states.oid_shuffle.val){
                $('.winamp-shuffle').css("display","block");
            } else {
                $('.winamp-shuffle').css("display","none");
            }

            vol_slider.slider( "value", states.oid_vol.val );
            seek_slider.slider( "value", parseInt(states.oid_seek.val) );

        }
        $(".winamp-btn").on("click", function(e){
            switch (e.target.id) {
                case 'mute':
                    Toggle('mute');
                    break;
                case 'play':
                        vis.setValue(data.oid_play, true);
                    break;
                case 'next':
                        vis.setValue(data.oid_next, true);
                    break;
                case 'prev':
                        vis.setValue(data.oid_prev, true);
                    break;
                case 'stop':
                        vis.setValue(data.oid_stop, true);
                    break;
                case 'pause':
                        Toggle('pause');
                    break;
                case 'shuffle':
                        Toggle('shuffle');
                    break;
                case 'repeat':
                        Toggle('repeat');
                    break;
                case 'playlist':
                       //vis.setValue(data.oid_next, true);
                    break;
                case 'library':
                        //vis.setValue(data.oid_next, true);
                    break;
                default:
            }
        });
        function Toggle(btn){
            var oid = 'oid_' + btn;
            var val = states[oid].val;
            var state = data['oid_' + btn];
            console.log('Press button - '+ btn +' / val='+val+' /state='+state);
            if (val === 0 || val === '0' || val === false || val === 'false' || val === 'off'){
                vis.setValue(state, true);
            } else if (val === 1 || val === '1' || val === true || val === 'true' || val === 'on'){
                vis.setValue(state, false);
            }
        }
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
