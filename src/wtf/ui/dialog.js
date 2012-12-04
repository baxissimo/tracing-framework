/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Popup dialog control.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.ui.Dialog');
goog.provide('wtf.ui.DialogOptions');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('wtf.events');
goog.require('wtf.events.KeyboardScope');
goog.require('wtf.timing');
goog.require('wtf.ui.Control');


/**
 * @typedef {{
 *   modal: (boolean|undefined)
 * }}
 */
wtf.ui.DialogOptions;



/**
 * Popup dialog control.
 *
 * @param {!wtf.ui.DialogOptions} options Dialog options object.
 * @param {!Element} parentElement Element to display in.
 * @param {goog.dom.DomHelper=} opt_dom DOM helper.
 * @constructor
 * @extends {wtf.ui.Control}
 */
wtf.ui.Dialog = function(options, parentElement, opt_dom) {
  goog.base(this, parentElement, opt_dom);
  var dom = this.getDom();

  // Setup keyboard handlers for closing/etc.
  var keyboard = wtf.events.getWindowKeyboard(dom);
  var keyboardScope = new wtf.events.KeyboardScope(keyboard);
  this.registerDisposable(keyboardScope);
  keyboardScope.addShortcut('esc', this.close, this);

  if (options.modal) {
    // Add shield.
    var shield = new wtf.ui.Dialog.Shield_(dom);
    this.registerDisposable(shield);
  }
};
goog.inherits(wtf.ui.Dialog, wtf.ui.Control);


/**
 * Z-index of the dialog.
 * @type {number}
 * @const
 * @private
 */
wtf.ui.Dialog.ZINDEX_ = 999999;


/**
 * @override
 */
wtf.ui.Dialog.prototype.enterDocument = function(parentElement) {
  var dom = this.getDom();

  // Create dialog DOM.
  var el = dom.createElement(goog.dom.TagName.DIV);
  goog.style.setStyle(el, {
    'position': 'fixed',
    'left': '50%',
    'top': '50%',
    'z-index': wtf.ui.Dialog.ZINDEX_,
    'opacity': 0,
    '-webkit-transform': 'scale(1.05)',
    '-moz-transform': 'scale(1.05)',
    'transform': 'scale(1.05)'
  });

  // Wrap root element in dialog DOM.
  var rootElement = this.getRootElement();
  dom.appendChild(el, rootElement);

  // Add dialog DOM to parent element instead of root user element.
  dom.appendChild(parentElement, el);

  // Offset by size after layout occurs.
  wtf.timing.setImmediate(function() {
    var size = goog.style.getSize(rootElement);
    goog.style.setStyle(el, {
      'margin-left': -(size.width / 2) + 'px',
      'margin-top': -(size.height / 2) + 'px'
    });
    // Kick off animations. This nested delay is required because of the CSS
    // injection.
    // TODO(benvanik): remove all of this once CSS is properly added
    wtf.timing.setImmediate(function() {
      goog.style.setStyle(el, {
        '-webkit-transition': 'all 0.218s',
        '-moz-transition': 'all 0.218s',
        'transition': 'all 0.218s',
        'opacity': 1,
        '-webkit-transform': 'scale(1.0)',
        '-moz-transform': 'scale(1.0)',
        'transform': 'scale(1.0)'
      });
    }, this);
  }, this);
};


/**
 * Closes the dialog.
 */
wtf.ui.Dialog.prototype.close = function() {
  // Remove the dialog DOM root.
  var dom = this.getDom();
  var rootElement = this.getRootElement();
  if (rootElement) {
    var el = dom.getParentElement(rootElement);
    goog.style.setStyle(el, {
      'opacity': 0,
      '-webkit-transform': 'scale(1.05)',
      '-moz-transform': 'scale(1.05)',
      'transform': 'scale(1.05)'
    });
    wtf.timing.setTimeout(218, function() {
      dom.removeNode(el);
      goog.dispose(this);
    }, this);
  }
};



/**
 * Modal dialog shield wrapper.
 * @param {!goog.dom.DomHelper} dom DOM helper.
 * @constructor
 * @extends {goog.Disposable}
 * @private
 */
wtf.ui.Dialog.Shield_ = function(dom) {
  goog.base(this);

  var el = dom.createElement(goog.dom.TagName.DIV);
  goog.style.setStyle(el, {
    'display': 'block',
    'opacity': 0,
    'background-color': 'white',
    'position': 'fixed',
    'left': 0,
    'right': 0,
    'top': 0,
    'bottom': 0,
    'z-index': wtf.ui.Dialog.ZINDEX_ - 1,
    '-webkit-transition': 'all 0.218s',
    '-moz-transition': 'all 0.218s',
    'transition': 'all 0.218s'
  });
  wtf.timing.setImmediate(function() {
    goog.style.setStyle(el, {
      'opacity': 0.75
    });
  });

  /**
   * Shield element.
   * @type {!Element}
   * @private
   */
  this.el_ = el;

  // Add to document.
  var doc = dom.getDocument();
  doc.body.appendChild(el);
};
goog.inherits(wtf.ui.Dialog.Shield_, goog.Disposable);


/**
 * @override
 */
wtf.ui.Dialog.Shield_.prototype.disposeInternal = function() {
  var el = this.el_;
  goog.style.setStyle(el, {
    'opacity': 0
  });
  wtf.timing.setTimeout(218, function() {
    goog.dom.removeNode(el);
  });
  goog.base(this, 'disposeInternal');
};