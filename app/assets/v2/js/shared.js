/* eslint-disable no-console */
/* eslint-disable nonblock-statement-body-position */
// helper functions

/**
 * Looks for a transaction receipt.  If it doesn't find one, it keeps running until it does.
 * @callback
 * @param {string} txhash - The transaction hash.
 * @param {function} f - The function passed into this callback.
 */
var callFunctionWhenTransactionMined = function(txHash, f) {
  var transactionReceipt = web3.eth.getTransactionReceipt(txHash, function(error, result) {
    if (result) {
      f();
    } else {
      setTimeout(function() {
        callFunctionWhenTransactionMined(txHash, f);
      }, 1000);
    }
  });
};

/**
 * Looks for web3.  Won't call the fucntion until its there
 * @callback
 * @param {function} f - The function passed into this callback.
 */
var callFunctionWhenweb3Available = function(f) {
  if (typeof document.web3network != 'undefined') {
    f();
  } else {
    setTimeout(function() {
      callFunctionWhenweb3Available(f);
    }, 1000);
  }
};

var loading_button = function(button) {
  button.prop('disabled', true);
  button.addClass('disabled');
  button.prepend('<img src=/static/v2/images/loading_white.gif style="max-width:20px; max-height: 20px">').addClass('disabled');
};

var attach_close_button = function() {
  $('body').delegate('.alert .closebtn', 'click', function(e) {
    $(this).parents('.alert').remove();
    $('.alert').each(function(index) {
      if (index == 0) $(this).css('top', 0);
      else {
        var new_top = (index * 66) + 'px';

        $(this).css('top', new_top);
      }
    });
  });
};


var update_metamask_conf_time_and_cost_estimate = function() {
  var confTime = 'unknown';
  var ethAmount = 'unknown';
  var usdAmount = 'unknown';

  var gasLimit = parseInt($('#gasLimit').val());
  var gasPrice = parseFloat($('#gasPrice').val());

  if (gasPrice) {
    ethAmount = Math.round(1000 * gasLimit * gasPrice / Math.pow(10, 9)) / 1000;
    usdAmount = Math.round(10 * ethAmount * document.eth_usd_conv_rate) / 10;
  }

  for (var i = 0; i < document.conf_time_spread.length - 1; i++) {
    var this_ele = (document.conf_time_spread[i]);
    var next_ele = (document.conf_time_spread[i + 1]);

    if (gasPrice <= parseFloat(next_ele[0]) && gasPrice > parseFloat(this_ele[0])) {
      confTime = Math.round(10 * next_ele[1]) / 10;
    }
  }

  $('#ethAmount').html(ethAmount);
  $('#usdAmount').html(usdAmount);
  $('#confTime').html(confTime);
};

var get_updated_metamask_conf_time_and_cost = function(gasPrice) {
  
  var confTime = 'unknown';
  var ethAmount = 'unknown';
  var usdAmount = 'unknown';

  var gasLimit = parseInt($('#gasLimit').val());

  if (gasPrice) {
    ethAmount = Math.round(1000000 * gasLimit * gasPrice / Math.pow(10, 9)) / 1000000;
    usdAmount = Math.round(10 * ethAmount * document.eth_usd_conv_rate) / 10;
  }

  for (var i = 0; i < document.conf_time_spread.length - 1; i++) {
    var this_ele = (document.conf_time_spread[i]);
    var next_ele = (document.conf_time_spread[i + 1]);

    if (gasPrice <= parseFloat(next_ele[0]) && gasPrice > parseFloat(this_ele[0])) {
      confTime = Math.round(10 * next_ele[1]) / 10;
    }
  }

  return {'eth': ethAmount, 'usd': usdAmount, 'time': confTime};
};

var unloading_button = function(button) {
  button.prop('disabled', false);
  button.removeClass('disabled');
  button.find('img').remove();
};

var sanitizeDict = function(d) {
  if (typeof d != 'object') {
    return d;
  }
  keys = Object.keys(d);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    d[key] = sanitize(d[key]);
  }
  return d;
};

var sanitizeAPIResults = function(results) {
  for (var i = 0; i < results.length; i++) {
    results[i] = sanitizeDict(results[i]);
  }
  return results;
};

function ucwords(str) {
  return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
    return $1.toUpperCase();
  });
}

var sanitize = function(str) {
  if (typeof str != 'string') {
    return str;
  }
  result = DOMPurify.sanitize(str);
  return result;
};

var waitforWeb3 = function(callback) {
  if (document.web3network) {
    callback();
  } else {
    var wait_callback = function() {
      waitforWeb3(callback);
    };

    setTimeout(wait_callback, 100);
  }
};

var normalizeURL = function(url) {
  return url.replace(/\/$/, '');
};

var _alert = function(msg, _class) {
  if (typeof msg == 'string') {
    msg = {
      'message': msg
    };
  }
  var numAlertsAlready = $('.alert:visible').length;
  var top = numAlertsAlready * 66;

  var html = function() {
    return (
      `<div class="alert ${_class}" style="top: ${top}px">
        <div class="message">
          <div class="content">
            ${alertMessage(msg)}
          </div>
        </div>
        ${closeButton(msg)}
      </div>`
    );
  };

  $('body').append(html);
};

var closeButton = function(msg) {
  var html = (msg['closeButton'] === false ? '' : '<span class="closebtn" >&times;</span>');

  return html;
};

var alertMessage = function(msg) {
  var html = `<strong>${typeof msg['title'] !== 'undefined' ? msg['title'] : ''}</strong>${msg['message']}`;

  return html;
};

var timestamp = function() {
  return Math.floor(Date.now() / 1000);
};


var showLoading = function() {
  $('.loading').css('display', 'flex');
  $('.nonefound').css('display', 'none');
  $('#primary_view').css('display', 'none');
  $('#actions').css('display', 'none');
  setTimeout(showLoading, 10);
};

/** Add the current profile to the interested profiles list. */
var add_interest = function(bounty_pk, data) {
  if (document.interested) {
    return;
  }
  mutate_interest(bounty_pk, 'new', data);
};

/** Remove the current profile from the interested profiles list. */
var remove_interest = function(bounty_pk, slash = false) {
  if (!document.interested) {
    return;
  }

  mutate_interest(bounty_pk, 'remove', slash);
};

/** Helper function -- mutates interests in either direction. */
var mutate_interest = function(bounty_pk, direction, data) {
  var request_url = '/actions/bounty/' + bounty_pk + '/interest/' + direction + '/';

  $('#submit').toggleClass('none');
  $('#interest a').toggleClass('btn')
    .toggleClass('btn-small')
    .toggleClass('button')
    .toggleClass('button--primary');

  if (direction === 'new') {
    _alert({ message: gettext("Thanks for letting us know that you're ready to start work.") }, 'success');
    $('#interest a').attr('id', 'btn-white');
  } else if (direction === 'remove') {
    _alert({ message: gettext("You've stopped working on this, thanks for letting us know.") }, 'success');
    $('#interest a').attr('id', '');
  }
  

  $.post(request_url, data).then(function(result) {
    result = sanitizeAPIResults(result);
    if (result.success) {
      if (direction === 'new') {
        _alert({ message: result.msg }, 'success');
        $('#interest a').attr('id', 'btn-white');
      } else if (direction === 'remove') {
        _alert({ message: result.msg }, 'success');
        $('#interest a').attr('id', '');
      }

      pull_interest_list(bounty_pk);
      return true;
    }
    return false;
  }).fail(function(result) {
    alert(result.responseJSON.error);
  });
};


var uninterested = function(bounty_pk, profileId, slash) {
  var data = {};
  var success_message = 'Contributor removed from bounty.';

  if (slash) {
    success_message = 'Contributor removed from bounty and rep dinged';
    data.slashed = true;
  }

  var request_url = '/actions/bounty/' + bounty_pk + '/interest/' + profileId + '/uninterested/';

  $.post(request_url, data, function(result) {
    result = sanitizeAPIResults(result);
    if (result.success) {
      _alert({ message: gettext(success_message) }, 'success');
      pull_interest_list(bounty_pk);
      return true;
    }
    return false;
  }).fail(function(result) {
    _alert({ message: gettext('got an error. please try again, or contact support@gitcoin.co') }, 'error');
  });
};


/** Pulls the list of interested profiles from the server. */
var pull_interest_list = function(bounty_pk, callback) {
  document.interested = false;
  var uri = '/actions/api/v0.1/bounties/?github_url=' + document.issueURL + '&not_current=1';
  var started = [];

  $.get(uri, function(results) {
    results = sanitizeAPIResults(results);
    const current = results.find(result => result.current_bounty);

    render_activity(current, results);
    if (current.interested) {
      var interested = current.interested;

      interested.forEach(function(_interested) {
        started.push(
          profileHtml(_interested.profile.handle)
        );
        if (_interested.profile.handle == document.contxt.github_handle) {
          document.interested = true;
        }
      });
    }
    if (started.length == 0) {
      started.push('<i class="fas fa-minus"></i>');
    }
    $('#started_owners_username').html(started);
    if (typeof callback != 'undefined') {
      callback(document.interested);
    }
  });
};

var profileHtml = function(handle, name) {
  return '<span><a href="https://gitcoin.co/profile/' +
    handle + '" target="_blank">' + (name ? name : handle) + '</span></a>';
};

// Update the list of bounty submitters.
var update_fulfiller_list = function(bounty_pk) {
  fulfillers = [];
  $.getJSON('/api/v0.1/bounties/' + bounty_pk, function(data) {
    data = sanitizeAPIResults(data);
    var fulfillmentList = data.fulfillments;

    $.each(fulfillmentList, function(index, value) {
      var fulfiller = value;

      fulfillers.push(fulfiller);
    });
    var tmpl = $.templates('#submitters');
    var html = tmpl.render(fulfillers);

    if (fulfillers.length == 0) {
      html = 'No one has submitted work yet.';
    }
    $('#submitter_list').html(html);
  });
  return fulfillers;
};

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}

function getParam(parameterName) {
  var result = null;
  var tmp = [];

  location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=');
      if (tmp[0] === parameterName)
        result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function timeDifference(current, previous, remaining, now_threshold_seconds) {

  var elapsed = current - previous;

  if (now_threshold_seconds && (now_threshold_seconds * 1000) > Math.abs(elapsed)) {
    return 'now';
  }

  if (current < previous) {
    return 'in ' + timeDifference(previous, current).replace(' ago', '');
  }

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var amt;
  var unit;

  if (elapsed < msPerMinute) {
    amt = Math.round(elapsed / 1000);
    unit = 'second';
  } else if (elapsed < msPerHour) {
    amt = Math.round(elapsed / msPerMinute);
    unit = 'minute';
  } else if (elapsed < msPerDay) {
    amt = Math.round(elapsed / msPerHour);
    unit = 'hour';
  } else if (elapsed < msPerMonth) {
    amt = Math.round(elapsed / msPerDay);
    unit = 'day';
  } else if (elapsed < msPerYear) {
    amt = Math.round(elapsed / msPerMonth);
    unit = 'month';
  } else {
    amt = Math.round(elapsed / msPerYear);
    unit = 'year';
  }
  var plural = amt != 1 ? 's' : '';

  if (remaining) return amt + ' ' + unit + plural;
  return amt + ' ' + unit + plural + ' ago';
}

var attach_change_element_type = function() {
  (function($) {
    $.fn.changeElementType = function(newType) {
      var attrs = {};

      $.each(this[0].attributes, function(idx, attr) {
        attrs[attr.nodeName] = attr.nodeValue;
      });

      this.replaceWith(function() {
        return $('<' + newType + '/>', attrs).append($(this).contents());
      });
    };
  })(jQuery);
};

// callbacks that can retrieve various metadata about a github issue URL

var retrieveAmount = function() {
  var ele = $('input[name=amount]');
  var target_ele = $('#usd_amount');

  if (target_ele.html() == '') {
    target_ele.html('<img style="width: 50px; height: 50px;" src=/static/v2/images/loading_v2.gif>');
  }

  var amount = $('input[name=amount]').val();
  var address = $('select[name=deonomination]').val();
  var denomination = tokenAddressToDetails(address)['name'];
  var request_url = '/sync/get_amount?amount=' + amount + '&denomination=' + denomination;

  // use cached conv rate if possible.
  if (document.conversion_rates && document.conversion_rates[denomination]) {
    var usd_amount = amount / document.conversion_rates[denomination];

    updateAmountUI(target_ele, usd_amount);
    return;
  }

  // if not, use remote one
  $.get(request_url, function(result) {

    // update UI
    var usd_amount = result['usdt'];
    var conv_rate = amount / usd_amount;

    updateAmountUI(target_ele, usd_amount);

    // store conv rate for later in cache
    if (typeof document.conversion_rates == 'undefined') {
      document.conversion_rates = {};
    }
    document.conversion_rates[denomination] = conv_rate;

  }).fail(function() {
    target_ele.html(' ');
    // target_ele.html('Unable to find USDT amount');
  });
};

var updateAmountUI = function(target_ele, usd_amount) {
  usd_amount = Math.round(usd_amount * 100) / 100;

  if (usd_amount > 1000000) {
    usd_amount = Math.round(usd_amount / 100000) / 10 + 'm';
  } else if (usd_amount > 1000) {
    usd_amount = Math.round(usd_amount / 100) / 10 + 'k';
  }
  target_ele.html('Approx: ' + usd_amount + ' USD');
};

var retrieveIssueDetails = function() {
  var ele = $('input[name=issueURL]');
  var target_eles = {
    'title': $('input[name=title]'),
    'keywords': $('input[name=keywords]'),
    'description': $('textarea[name=description]')
  };
  var issue_url = ele.val();

  if (typeof issue_url == 'undefined') {
    return;
  }
  if (issue_url.length < 5 || issue_url.indexOf('github') == -1) {
    return;
  }
  var request_url = '/sync/get_issue_details?url=' + encodeURIComponent(issue_url);

  $.each(target_eles, function(i, ele) {
    ele.addClass('loading');
  });
  $.get(request_url, function(result) {
    result = sanitizeAPIResults(result);
    if (result['keywords']) {
      var keywords = result['keywords'];

      target_eles['keywords'].val(keywords.join(', '));
    }
    if (result['description']) {
      target_eles['description'].val(result['description']);
    }
    if (result['title']) {
      target_eles['title'].val(result['title']);
    }
    $.each(target_eles, function(i, ele) {
      ele.removeClass('loading');
    });
  }).fail(function() {
    $.each(target_eles, function(i, ele) {
      ele.removeClass('loading');
    });
  });
};


var randomElement = function(array) {
  var length = array.length;
  var randomNumber = Math.random();
  var randomIndex = Math.floor(randomNumber * length);

  return array[randomIndex];
};

var mixpanel_track_once = function(event, params) {
  if (document.listen_for_web3_iterations == 1 && mixpanel) {
    mixpanel.track(event, params);
  }
};

/* eslint-disable no-lonely-if */
var currentNetwork = function(network) {

  $('.navbar-network').removeClass('hidden');
  let tooltip_info;

  document.web3network = network;
  if (document.location.href.startsWith('https://gitcoin.co')) { // Live
    if (network == 'mainnet') {
      $('#current-network').text('Main Ethereum Network');
      $('.navbar-network').attr('title', '');
      $('.navbar-network i').addClass('green');
      $('.navbar-network i').removeClass('red');
      $('#navbar-network-banner').removeClass('network-banner--warning');
      $('#navbar-network-banner').addClass('hidden');
    } else {
      if (!network) {
        info = gettext('Web3 disabled. Please install ') +
          '<a href="https://metamask.io/?utm_source=gitcoin.co&utm_medium=referral" target="_blank" rel="noopener noreferrer">Metamask</a>';
        $('#current-network').text(gettext('Metamask Not Enabled'));
        $('#navbar-network-banner').html(info);
      } else if (network == 'locked') {
        info = gettext('Web3 locked. Please unlock ') +
          '<a href="https://metamask.io/?utm_source=gitcoin.co&utm_medium=referral" target="_blank" rel="noopener noreferrer">Metamask</a>';
        $('#current-network').text(gettext('Metamask Locked'));
        $('#navbar-network-banner').html(info);
      } else {
        info = gettext('Connect to Mainnet via Metamask');
        $('#current-network').text(gettext('Unsupported Network'));
        $('#navbar-network-banner').html(info);
      }

      $('.navbar-network i').addClass('red');
      $('.navbar-network i').removeClass('green');
      $('#navbar-network-banner').addClass('network-banner--warning');
      $('#navbar-network-banner').removeClass('hidden');

      if ($('.ui-tooltip.ui-corner-all.ui-widget-shadow.ui-widget.ui-widget-content').length == 0) {
        $('.navbar-network').attr('title', '<div class="tooltip-info tooltip-xs">' + info + '</div>');
      }
    }
  } else { // Staging
    if (network == 'rinkeby') {
      $('#current-network').text('Rinkeby Network');
      $('.navbar-network').attr('title', '');
      $('.navbar-network i').addClass('green');
      $('.navbar-network i').removeClass('red');
      $('#navbar-network-banner').removeClass('network-banner--warning');
      $('#navbar-network-banner').addClass('hidden');
    } else {
      if (!network) {
        info = gettext('Web3 disabled. Please install ') +
          '<a href="https://metamask.io/?utm_source=gitcoin.co&utm_medium=referral" target="_blank" rel="noopener noreferrer">Metamask</a>';
        $('#current-network').text(gettext('Metamask Not Enabled'));
        $('#navbar-network-banner').html(info);
      } else if (network == 'locked') {
        info = gettext('Web3 locked. Please unlock ') +
          '<a href="https://metamask.io/?utm_source=gitcoin.co&utm_medium=referral" target="_blank" rel="noopener noreferrer">Metamask</a>';
        $('#current-network').text(gettext('Metamask Locked'));
        $('#navbar-network-banner').html(info);
      } else {
        info = gettext('Connect to Rinkeby / Custom RPC via Metamask');
        $('#current-network').text(gettext('Unsupported Network'));
        $('#navbar-network-banner').html(info);
      }

      $('.navbar-network i').addClass('red');
      $('.navbar-network i').removeClass('green');
      $('#navbar-network-banner').addClass('network-banner--warning');
      $('#navbar-network-banner').removeClass('hidden');

      if ($('.ui-tooltip.ui-corner-all.ui-widget-shadow.ui-widget.ui-widget-content').length == 0) {
        $('.navbar-network').attr('title', '<div class="tooltip-info tooltip-xs">' + info + '</div>');
      }
    }
  }
};
/* eslint-enable no-lonely-if */

var trigger_primary_form_web3_hooks = function() {
  // detect web3, and if not, display a form telling users they must be web3 enabled.
  var params = {
    page: document.location.pathname
  };

  if ($('#primary_form').length) {
    var is_zero_balance_not_okay = document.location.href.indexOf('/faucet') == -1;

    if (typeof web3 == 'undefined') {
      $('#no_metamask_error').css('display', 'block');
      $('#zero_balance_error').css('display', 'none');
      $('#robot_error').removeClass('hidden');
      $('#primary_form').addClass('hidden');
      $('.submit_bounty .newsletter').addClass('hidden');
      $('#unlock_metamask_error').css('display', 'none');
      $('#no_issue_error').css('display', 'none');
      mixpanel_track_once('No Metamask Error', params);
    } else if (!web3.eth.coinbase) {
      $('#unlock_metamask_error').css('display', 'block');
      $('#zero_balance_error').css('display', 'none');
      $('#no_metamask_error').css('display', 'none');
      $('#robot_error').removeClass('hidden');
      $('#primary_form').addClass('hidden');
      $('.submit_bounty .newsletter').addClass('hidden');
      $('#no_issue_error').css('display', 'none');
      mixpanel_track_once('Unlock Metamask Error', params);
    } else if (is_zero_balance_not_okay && document.balance == 0) {
      $('#zero_balance_error').css('display', 'block');
      $('#robot_error').removeClass('hidden');
      $('#primary_form').addClass('hidden');
      $('.submit_bounty .newsletter').addClass('hidden');
      $('#unlock_metamask_error').css('display', 'none');
      $('#no_metamask_error').css('display', 'none');
      $('#no_issue_error').css('display', 'none');
      mixpanel_track_once('Zero Balance Metamask Error', params);
    } else {
      $('#zero_balance_error').css('display', 'none');
      $('#unlock_metamask_error').css('display', 'none');
      $('#no_metamask_error').css('display', 'none');
      $('#no_issue_error').css('display', 'block');
      $('#robot_error').addClass('hidden');
      $('#primary_form').removeClass('hidden');
      $('.submit_bounty .newsletter').removeClass('hidden');
    }
  }
};


var trigger_faucet_form_web3_hooks = function() {
  var params = {};

  if ($('#faucet_form').length) {
    var balance = document.balance;

    $('#ethAddress').val(web3.eth.accounts[0]);
    var faucet_amount = parseInt($('#currentFaucet').val() * (Math.pow(10, 18)));

    if (typeof web3 == 'undefined') {
      $('#no_metamask_error').css('display', 'block');
      $('#faucet_form').addClass('hidden');
      mixpanel_track_once('No Metamask Error', params);
      return;
    } else if (!web3.eth.coinbase) {
      $('#no_metamask_error').css('display', 'none');
      $('#unlock_metamask_error').css('display', 'block');
      $('#faucet_form').addClass('hidden');
      return;
    } else if (balance >= faucet_amount) {
      $('#no_metamask_error').css('display', 'none');
      $('#unlock_metamask_error').css('display', 'none');
      $('#over_balance_error').css('display', 'block');
      $('#faucet_form').addClass('hidden');
      mixpanel_track_once('Faucet Available Funds Metamask Error', params);
    } else {
      $('#over_balance_error').css('display', 'none');
      $('#no_metamask_error').css('display', 'none');
      $('#unlock_metamask_error').css('display', 'none');
      $('#faucet_form').removeClass('hidden');
    }
  }
  if ($('#admin_faucet_form').length) {
    if (typeof web3 == 'undefined') {
      $('#no_metamask_error').css('display', 'block');
      $('#faucet_form').addClass('hidden');
      mixpanel_track_once('No Metamask Error', params);
      return;
    }
    if (!web3.eth.coinbase) {
      $('#unlock_metamask_error').css('display', 'block');
      $('#faucet_form').addClass('hidden');
      mixpanel_track_once('Unlock Metamask Error', params);
      return;
    }
    web3.eth.getBalance(web3.eth.coinbase, function(errors, result) {
      var balance = result.toNumber();

      if (balance == 0) {
        $('#zero_balance_error').css('display', 'block');
        $('#admin_faucet_form').remove();
        mixpanel_track_once('Zero Balance Metamask Error', params);
      }
    });
  }
};

var trigger_form_hooks = function() {
  trigger_primary_form_web3_hooks();
  trigger_faucet_form_web3_hooks();
};

function getNetwork(id) {
  var networks = {
    '1': 'mainnet',
    '2': 'morden',
    '3': 'ropsten',
    '4': 'rinkeby',
    '42': 'kovan'
  };

  return networks[id] || 'custom network';
}

// figure out what version of web3 this is, whether we're logged in, etc..
var listen_for_web3_changes = function() {

  if (!document.listen_for_web3_iterations) {
    document.listen_for_web3_iterations = 1;
  } else {
    document.listen_for_web3_iterations += 1;
  }

  if (typeof web3 == 'undefined') {
    currentNetwork();
    trigger_form_hooks();
  } else if (typeof web3 == 'undefined' || typeof web3.eth == 'undefined' || typeof web3.eth.coinbase == 'undefined' || !web3.eth.coinbase) {
    currentNetwork('locked');
    trigger_form_hooks();
  } else {
    web3.eth.getBalance(web3.eth.coinbase, function(errors, result) {
      if (typeof result != 'undefined') {
        document.balance = result.toNumber();
      }
    });

    web3.version.getNetwork(function(error, netId) {
      if (error) {
        currentNetwork();
      } else {
        var network = getNetwork(netId);

        currentNetwork(network);
        trigger_form_hooks();
      }
    });
  }
};

var actions_page_warn_if_not_on_same_network = function() {
  var user_network = document.web3network;

  if (typeof user_network == 'undefined') {
    user_network = 'no network';
  }
  var bounty_network = $('input[name=network]').val();

  if (bounty_network != user_network) {
    var msg = 'Warning: You are on ' + user_network + ' and this bounty is on the ' + bounty_network + ' network.  Please change your network to the ' + bounty_network + ' network.';

    _alert({ message: gettext(msg) }, 'error');
  }
};

attach_change_element_type();

window.addEventListener('load', function() {
  setInterval(listen_for_web3_changes, 300);
  attach_close_button();
});

var promptForAuth = function(event) {
  var denomination = $('#token option:selected').text();
  var tokenAddress = $('#token option:selected').val();

  if (!denomination) {
    return;
  }

  if (denomination == 'ETH') {
    $('input, textarea, select').prop('disabled', '');
  } else {
    var token_contract = web3.eth.contract(token_abi).at(tokenAddress);
    var from = web3.eth.coinbase;
    var to = bounty_address();

    token_contract.allowance.call(from, to, function(error, result) {
      if (error || result.toNumber() == 0) {
        _alert("You have not yet enabled this token.  To enable this token, go to the <a style='padding-left:5px;' href='/settings/tokens'> Token Settings page and enable it</a>. (this is only needed one time per token)", 'warning');
        $('input, textarea, select').prop('disabled', 'disabled');
        $('select[name=deonomination]').prop('disabled', '');
      } else {
        $('input, textarea, select').prop('disabled', '');
      }
    });

  }
};

var setUsdAmount = function(event) {
  var amount = $('input[name=amount]').val();
  var denomination = $('#token option:selected').text();
  var estimate = getUSDEstimate(amount, denomination, function(estimate) {
    if (estimate['value']) {
      $('#usd-amount-wrapper').css('visibility', 'visible');
      $('#usd_amount_text').css('visibility', 'visible');

      $('#usd_amount').val(estimate['value_unrounded']);
      $('#usd_amount_text').html(estimate['rate_text']);
      $('#usd_amount').removeAttr('disabled');
    } else {
      $('#usd-amount-wrapper').css('visibility', 'hidden');
      $('#usd_amount_text').css('visibility', 'hidden');

      $('#usd_amount_text').html('');
      $('#usd_amount').prop('disabled', true);
      $('#usd_amount').val('');
    }
  });
};

var usdToAmount = function(event) {
  var usdAmount = $('input[name=usd_amount').val();
  var denomination = $('#token option:selected').text();
  var estimate = getAmountEstimate(usdAmount, denomination, function(amountEstimate) {
    if (amountEstimate['value']) {
      $('#amount').val(amountEstimate['value']);
      $('#usd_amount_text').html(amountEstimate['rate_text']);
    }
  });
};
