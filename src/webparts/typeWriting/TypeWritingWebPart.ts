/**
 * @file
 * TypeWriting Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'TypeWritingStrings';
import { ITypeWritingWebPartProps } from './ITypeWritingWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';


var TypeWriting = require('typewriting');

export default class TypeWritingWebPart extends BaseClientSideWebPart<ITypeWritingWebPartProps> {

  private guid: string;
  private typeWriting: any;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);

    this.guid = this.getGuid();
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var style = "style='padding: 5px;";
    if (this.properties.font != null)
      style += "font-family: " + this.properties.font + ';';
    if (this.properties.fontSize != null)
      style += "font-size: " + this.properties.fontSize + ';';
    if (this.properties.fontColor != null)
      style += "color: " + this.properties.fontColor  + ';';
    if (this.properties.backgroundColor != null)
      style += "background-color: " + this.properties.backgroundColor  + ';';
    style += "'";
    var html = "<div " + style + " id='" + this.guid + "-typewriting'></div>";
    this.domElement.innerHTML = html;

    var text = this.properties.text;
    if (this.properties.splitLines === true && text != null) {
      var splitted = text.split("\n");
      text = splitted[0];
    }

    if (this.typeWriting != null)
      this.typeWriting = null;
    this.typeWriting = new TypeWriting({
        targetElement   : document.getElementById(this.guid + "-typewriting"),
        inputString     : text,
        typing_interval : this.properties.typingInterval,
        blink_interval  : this.properties.blinkInterval + 'ms',
        cursor_color    : this.properties.cursorColor,
    }, () => {
        //console.log("END");
    });

     if (this.properties.splitLines === true && text != null) {
       var splitted2 = this.properties.text.split("\n");
       for (var i = 1; i < splitted2.length; i++) {
          this.typeWriting.rewrite(splitted2[i], () => {});
       }
     }
  }

  /**
   * @function
   * Generates a GUID
   */
  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * @function
   * Generates a GUID part
   */
  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  /**
   * @function
   * PropertyPanel settings definition
   */
  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('text', {
                  label: strings.Text,
                  multiline: true
                }),
                PropertyPaneToggle('splitLines', {
                  label: strings.SplitLines
                })
              ]
            },
            {
              groupName: strings.TypeWritingGroupName,
              groupFields: [
                PropertyPaneSlider('typingInterval', {
                  label: strings.TypingInterval,
                  min: 0,
                  max: 500,
                  step: 10
                }),
                PropertyPaneSlider('blinkInterval', {
                  label: strings.BlinkInterval,
                  min: 0,
                  max: 5000,
                  step: 50
                }),
                PropertyFieldColorPicker('cursorColor', {
                  label: strings.CursorColor,
                  initialColor: this.properties.cursorColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyFieldFontPicker('font', {
                  label: strings.Font,
                  useSafeFont: true,
                  previewFonts: true,
                  initialValue: this.properties.font,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldFontSizePicker('fontSize', {
                  label: strings.FontSize,
                  usePixels: true,
                  preview: true,
                  initialValue: this.properties.fontSize,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('fontColor', {
                  label: strings.FontColor,
                  initialColor: this.properties.fontColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('backgroundColor', {
                  label: strings.BackgroundColor,
                  initialColor: this.properties.backgroundColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
