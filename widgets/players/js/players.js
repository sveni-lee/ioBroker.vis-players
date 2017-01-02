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
        oid_play:    {val: undefined, role: 'button.play', selector: '', objName: 'play'},
        oid_next:    {val: undefined, role: 'button.next', selector: '', objName: 'next'},
        oid_prev:    {val: undefined, role: 'button.prev', selector: '', objName: ''},
        oid_stop:    {val: undefined, role: 'button.stop', selector: '', objName: ''},
        oid_pause:   {val: undefined, role: 'button.pause', selector: '', objName: ''},
        oid_seek:    {val: 0,         role: 'media.seek', selector: '', objName: ''},
        oid_vol:     {val: 0,         role: 'level.volume', selector: '', objName: ''},
        oid_mute:    {val: undefined, role: 'media.mute', selector: '', objName: ''},
        oid_shuffle: {val: undefined, role: 'media.mode.shuffle', selector: '', objName: ''},
        oid_repeat:  {val: undefined, role: 'media.mode.repeat', selector: '', objName: ''},
        oid_artist:  {val: '',        role: 'media.artist', selector: '', objName: ''},
        oid_title:   {val: '',        role: 'media.title', selector: '', objName: ''},
        oid_album:   {val: '',        role: 'media.album', selector: '', objName: ''},
        oid_bitrate: {val: '',        role: 'media.bitrate', selector: '', objName: ''}
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
            vol_slider.slider({
                range: "min",
                min: 0,
                value: vis.states['data.oid_vol.val'],//states.oid_vol.val,
                start: function(event,ui) {},
                slide: function(event, ui) {
                    vis.setValue(data.oid_vol, ui.value);
                },
                stop: function(event,ui) {}
            });
            seek_slider.slider({
                range: "min",
                min: 0,
                max: 100,
                value: 0,//states.oid_seek.val,
                start: function(event,ui) {},
                slide: function(event, ui) {
                    vis.setValue(data.oid_seek, ui.value);
                },
                stop: function(event,ui) {}
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
            vol_slider.slider("value", states.oid_vol.val);
            seek_slider.slider("value", parseInt(states.oid_seek.val));
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
                    //$div.find("#winamp-playlist-container").hide();
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
        // subscribe on updates of values
        for (var s in vis.binds.players.states) {
            if (!data[s] || data[s] == 'nothing_selected') continue;
            vis.states.bind(data[s] + '.val', function () {
                updateStates();
            });
        }
        // initial update
        updateStates();
    },
    createWidgetWinampPlaylist: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        var playlist;
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds.players.createWidgetWinampPlaylist(widgetID, view, data, style);
            }, 100);
        }

        if (data['oid_playlist'] && data['oid_playlist'] !== 'nothing_selected'){
            playlist = vis.states[data['oid_playlist'] + '.val'];
            updateStates(playlist);
        }
        function updateStates(pl) {
             playlist = JSON.parse(pl);
             $div.find("#winamp-playlist-container").empty();
             playlist.forEach(function(item, i, plst) {
                 var obj = playlist[i];
                 var text = " ";
                 if (obj.file){
                     text = obj.file.split('/');
                     text = text[text.length - 1];
                 }
                 $div.find("#winamp-playlist-container").append("<li class='item"+(i+1)+"'>"+(i+1)+' - '+ text+"</li>");
             });

            $div.find('#winamp-playlist-container').on('click', "li", function(){
                var n=$(this).index();
                vis.setValue(data.oid_playid, n);
            });
        }
       /* $(".winamp-btn").on("click", function(e){
        });*/

        // subscribe on updates of values
        if (data.oid_playlist) {
            vis.states.bind(data.oid_playlist + '.val', function (e, newVal, oldVal) {
                updateStates(newVal);
            });
        }
        if (data.oid_pos) {
            vis.states.bind(data.oid_id + '.val', function (e, newVal, oldVal) {
                $div.find("#winamp-playlist-container").children().removeClass('active');
                var id = parseInt(newVal) + 1;
                setTimeout(function() {
                    $div.find("#winamp-playlist-container .item" + id).addClass("active");
                }, 100);
            });
        }
    }

};
if (vis.editMode) {
    /*vis.binds.players = function (widgetID, view, newId, attr, isCss) {
        console.log('---------: ' + widgetID +' - '+view+' - '+newId+' - '+attr+' - '+isCss);
        newId = newId ? newId.substring(0, newId.length - attr.length + 'oid_'.length) : '';
        var changed = [];
        for (var s in vis.binds.players.states) {
            if (s === 'oid_alias' || !vis.binds.players.states[s].objName) continue;
            if (vis.objects[newId + vis.binds.players.states[s].objName]) {
                changed.push(s);
                vis.views[view].widgets[widgetID].data[s] 	= newId + vis.binds.players.states[s].objName;
                vis.widgets[widgetID].data[s] 				= newId + vis.binds.players.states[s].objName;
            }
        }
        return changed;
    };*/
}
	
vis.binds.players.showVersion();
