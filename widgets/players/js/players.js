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
        oid_play: {val: undefined, selector: '.alias_value', blink: false, objName: 'alias'},
        oid_next: {val: undefined, selector: '', blink: false, objName: 'ctemp'},
        oid_prev: {val: undefined, selector: '', blink: false, objName: 'etemp'}
    }
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
