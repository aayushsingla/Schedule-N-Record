// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The window (tab) opened and navigated to receiver.html.
var receiver = null;

// Open a new window of receiver.html when browser action icon is clicked.
function playCapturedStream(stream) {
  if (!stream) {
    console.error('Error starting tab capture: ' +
                  (chrome.runtime.lastError.message || 'UNKNOWN'));
    return;
  }
  if (receiver != null) {
    receiver.close();
  }
  receiver = window.open('../ui/player.html');
  receiver.currentStream = stream;
}

