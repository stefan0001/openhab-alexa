/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

const log = require('@lib/log.js');
const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.ModeController interface directive class
 * @extends AlexaDirective
 */
class AlexaModeController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    // Append instance name to interface name
    this.interface = 'ModeController:' + directive.header.instance;
    this.map = {
      setMode: 'setMode',
      adjustMode: 'adjustMode'
    };
  }

  /**
   * Set mode
   */
  setMode() {
    const postItem = Object.assign(this.propertyMap[this.interface].mode.item, {
      state: this.directive.payload.mode
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust mode
   */
  adjustMode() {
    const properties = this.propertyMap[this.interface];
    const postItem = Object.assign({}, properties.mode.item);

    this.getItemState(postItem).then((item) => {
      // Define supported modes list stripping alternate names
      const supportedModes = properties.mode.parameters.supportedModes.map(mode => mode.split('=').shift());
      // Find current mode index
      const index = supportedModes.findIndex(mode => mode === item.state);

      // Throw error if current mode not found
      if (index === -1 ) {
        throw {cause: 'Current mode not found in supported list', item: item, supported: supportedModes};
      }

      // Set adjusted mode
      postItem.state = supportedModes[index + this.directive.payload.modeDelta];

      if (typeof postItem.state !== 'undefined') {
        this.postItemsAndReturn([postItem]);
      } else {
        this.returnAlexaErrorResponse({
          payload: {
            type: 'VALUE_OUT_OF_RANGE',
            message: 'Adjusted mode value is out of range'
          }
        });
      }
    }).catch((error) => {
      log.error('adjustMode failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaModeController;
