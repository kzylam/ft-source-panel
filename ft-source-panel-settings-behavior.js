/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronMeta } from '@polymer/iron-meta/iron-meta.js';

// Make sure the "FileThis" namespace exists
window.FileThis = window.FileThis || {};

/**
 * `<ft-source-panel-settings-behavior>`
 *
 * Mixin to get source panel settings properties.
 *
 * @demo
 * @polymerBehavior FileThis.SourcePanelSettingsBehavior
 */
FileThis.SourcePanelSettingsBehavior = {

    observers:[
        '_onInternalSettingsChanged(ftSourcePanelFilters, ftSourcePanelShowFilters, ftSourcePanelHeading, ftSourcePanelShowHeading, ftSourcePanelShowSearchField)',
    ],

    properties: {

        /**
         * Show a filter popup button.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftSourcePanelShowFilters:
        {
            type: Object,
            value: true,
            notify: true,
        },

        /** JSON expression that indicates which filters to display to the user. */
        ftSourcePanelFilters:
            {
                type: String,
                value: '[\n' +
                    '\t{"id":"all", "name":"All"},\n' +
                    '\t{"id":"banking", "name":"Banking"},\n' +
                    '\t{"id":"favorites", "name":"Favorites"},\n' +
                    '\t{"id":"financial", "name":"Financial"},\n' +
                    '\t{"id":"payroll", "name":"Payroll"},\n' +
                    '\t{"id":"tax", "name":"Tax"},\n' +
                    '\t{"id":"utilities", "name":"Utilities"}\n' +
                    ']',
                notify: true,
                observer: "_onFtSourcePanelFiltersChanged",
            },

        ftSourcePanelFiltersDefault:
            {
                type: String,
                value: '[\n' +
                    '\t{"id":"all", "name":"All"},\n' +
                    '\t{"id":"banking", "name":"Banking"},\n' +
                    '\t{"id":"favorites", "name":"Favorites"},\n' +
                    '\t{"id":"financial", "name":"Financial"},\n' +
                    '\t{"id":"payroll", "name":"Payroll"},\n' +
                    '\t{"id":"tax", "name":"Tax"},\n' +
                    '\t{"id":"utilities", "name":"Utilities"}\n' +
                    ']',
            },

        /** Heading to display when "showHeading" is true. */
        ftSourcePanelHeading:
            {
                type: String,
                value: "Sites",
                notify: true,
            },

        /**
         * Show a heading string.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftSourcePanelShowHeading:
        {
            type: Object,
            value: true,
            notify: true,
        },

        /**
         * Show a button that lets users choose to show the search field.
         *
         * Note that you can provide the strings "true" and "false" as attribute values.
         *
         * @type {boolean}
         */
        ftSourcePanelShowSearchField:
        {
            type: Object,
            value: true,
            notify: true,
        },

    },

    attached: function()
    {
        this.async(function()
        {
            this._applySettingToProperty("ft-source-panel-filters", "ftSourcePanelFilters");
            this._applySettingToProperty("ft-source-panel-show-filters", "ftSourcePanelShowFilters");
            this._applySettingToProperty("ft-source-panel-heading", "ftSourcePanelHeading");
            this._applySettingToProperty("ft-source-panel-show-heading", "ftSourcePanelShowHeading");
            this._applySettingToProperty("ft-source-panel-show-search-field", "ftSourcePanelShowSearchField");
        });
    },

    _applySettingToProperty: function(settingName, propertyName)
    {
        var meta = new IronMeta({type: "setting", key: settingName});
        var value = meta.value;
        if (value !== undefined)
            this.set(propertyName, value);
    },

    _onInternalSettingsChanged: function(to)
    {
        this.fire("internal-settings-changed");
    },

    generateSettingsImport: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var theImport = indent + "<link rel=\"import\" href=\"https://connect.filethis.com/{{RELEASE_VERSION}}/ft-source-panel/ft-source-panel.html\">\n";

        return theImport;
    },

    generateSettingsElement: function(indent)
    {
        if (!this.hasSettings())
            return "";

        var settings = indent + "<ft-source-panel-settings";

        // Keep alphabetized
        if (this.ftSourcePanelHeading !== "Sites")
            settings += this._buildSettingAttribute("ft-source-panel-heading", this.ftSourcePanelHeading, indent);
        if (this.ftSourcePanelFilters !== this.ftSourcePanelFiltersDefault)
        {
            var adjusted = this._indentLines(indent, this.ftSourcePanelFilters);
            settings += this._buildSettingAttributeSingleQuoted("ft-source-panel-filters", adjusted, indent);
        }
        if (this.ftSourcePanelShowFilters !== true)
            settings += this._buildSettingAttribute("ft-source-panel-show-filters", "false", indent);
        if (this.ftSourcePanelShowHeading !== true)
            settings += this._buildSettingAttribute("ft-source-panel-show-heading", "false", indent);
        if (this.ftSourcePanelShowSearchField !== true)
            settings += this._buildSettingAttribute("ft-source-panel-show-search-field", "false", indent);

        settings += ">\n" + indent + "</ft-source-panel-settings>\n";

        return settings;
    },

    // TODO: Factor out from here and copies in other classes
    _buildSettingAttribute: function(propertyName, propertyValue, indent)
    {
        return '\n' + indent + '    ' + propertyName + '="' + propertyValue + '"';
    },
    _buildSettingAttributeSingleQuoted: function(propertyName, propertyValue, indent)
    {
        return '\n' + indent + '    ' + propertyName + "='" + propertyValue + "'";
    },

    _indentLines: function(indent, expression)
    {
        var deeperIndent = "\t" + indent;
        var result = "";
        var lines = expression.split("\n");
        for (var index = 0; index < lines.length; index++)
        {
            var line = lines[index];
            result += "\n" + deeperIndent + line;
        }
        return result;
    },

    hasSettings: function()
    {
        if (this.ftSourcePanelFilters !== this.ftSourcePanelFiltersDefault)
            return true;
        if (this.ftSourcePanelShowFilters !== true)
            return true;
        if (this.ftSourcePanelShowHeading !== true)
            return true;
        if (this.ftSourcePanelHeading !== "Sites")
            return true;
        if (this.ftSourcePanelShowSearchField !== true)
            return true;
        return false;
    },

    revertToDefaults: function()
    {
        this.ftSourcePanelFilters = this.ftSourcePanelFiltersDefault;
        this.ftSourcePanelShowFilters = true;
        this.ftSourcePanelShowHeading = true;
        this.ftSourcePanelHeading = "Sites";
        this.ftSourcePanelShowSearchField = true;
    },

    _onFtSourcePanelFiltersChanged: function(to, from)
    {
        this.fire("ft-source-panel-filters-changed-in-behavior");
    },
}
