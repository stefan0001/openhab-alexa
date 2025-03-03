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

module.exports = {
  description: "door lock",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/doorLock",
      "type": "Switch",
      "name": "doorLock",
      "label": "Door Lock",
      "tags": ["Lock"]
    }
  ],
  expected: {
    "doorLock": {
      "capabilities": [
        "Alexa",
        "Alexa.LockController.lockState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SMARTLOCK"],
      "friendlyName": "Door Lock"
    }
  }
};
