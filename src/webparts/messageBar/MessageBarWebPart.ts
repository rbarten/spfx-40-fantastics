/**
 * @file
 * Message Bar Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneToggle,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'MessageBarStrings';
import { IMessageBarWebPartProps } from './IMessageBarWebPartProps';

//Imports property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';
import { PropertyFieldFontPicker } from 'sp-client-custom-fields/lib/PropertyFieldFontPicker';
import { PropertyFieldFontSizePicker } from 'sp-client-custom-fields/lib/PropertyFieldFontSizePicker';
import { PropertyFieldIconPicker } from 'sp-client-custom-fields/lib/PropertyFieldIconPicker';
import { PropertyFieldRichTextBox } from 'sp-client-custom-fields/lib/PropertyFieldRichTextBox';

export default class MessageBarWebPart extends BaseClientSideWebPart<IMessageBarWebPartProps> {

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    var style = "style='";
    if (this.properties.font != null)
      style += "font-family: " + this.properties.font + ';';
    if (this.properties.fontSize != null)
      style += "font-size: " + this.properties.fontSize + ';';
    if (this.properties.fontColor != null)
      style += "color: " + this.properties.fontColor  + ';';
    if (this.properties.backgroundColor != null)
      style += "background-color: " + this.properties.backgroundColor  + ';';
    style += "'";

    var html = '';
    if (this.properties.enabled != false) {
      html += '<div ' + style + '>';
      html += ' <div class="ms-MessageBar-content">';
      html += '   <table border="0" cellspacing="0" cellpadding="0"><tr>';
      html += '   <td align="top" valign="middle"><div class="ms-MessageBar-icon" style="padding-left: 10px;">';
      html += '     <i class="ms-Icon ' + this.properties.icon + '" style="font-size: ' + this.properties.fontSize + '"></i>';
      html += '   </div></td>';
      html += '   <td align="top" valign="middle"><div class="">';
      html += this.properties.text;
      html += '   </div></td>';
      html += '   </tr></table>';
      html += '  </div>';
      html += '</div>';
    }
    this.domElement.innerHTML = html;
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
                PropertyPaneToggle('enabled', {
                  label: strings.Enabled
                }),
                PropertyFieldIconPicker('icon', {
                  label: strings.Icon,
                  initialValue: this.properties.icon,
                  orderAlphabetical: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldRichTextBox('text', {
                  label: strings.Text,
                  initialValue: this.properties.text,
                  inline: false,
                  minHeight: 100,
                  mode: 'basic',
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
