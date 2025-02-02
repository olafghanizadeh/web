/* eslint-disable no-console */
/* eslint-disable nonblock-statement-body-position */
load_tokens();

/* Check if quickstart page is to be shown */
var localStorage;
var quickstartURL = document.location.origin + '/bounty/quickstart';

try {
  localStorage = window.localStorage;
} catch (e) {
  localStorage = {};
}

if (localStorage['quickstart_dontshow'] !== 'true' &&
    doShowQuickstart(document.referrer) &&
    doShowQuickstart(document.URL)) {
  window.location = quickstartURL;
}

function doShowQuickstart(url) {
  var fundingURL = document.location.origin + '/funding/new\\?';
  var bountyURL = document.location.origin + '/bounty/new\\?';
  var blacklist = [ fundingURL, bountyURL, quickstartURL ];

  for (var i = 0; i < blacklist.length; i++) {
    if (url.match(blacklist[i])) {
      return false;
    }
  }

  return true;
}

// Wait until page is loaded, then run the function
$(document).ready(function() {
  // Load sidebar radio buttons from localStorage
  if (getParam('source')) {
    $('input[name=issueURL]').val(getParam('source'));
  } else if (getParam('url')) {
    $('input[name=issueURL]').val(getParam('url'));
  } else if (localStorage['issueURL']) {
    $('input[name=issueURL]').val(localStorage['issueURL']);
  }
  if (localStorage['project_type']) {
    $('select[name=project_type] option').prop('selected', false);
    $(
      "select[name=project_type] option[value='" +
        localStorage['project_type'] +
        "']"
    ).prop('selected', true);
  }
  if (localStorage['permission_type']) {
    $('select[name=permission_type] option').prop('selected', false);
    $(
      "select[name=permission_type] option[value='" +
        localStorage['permission_type'] +
        "']"
    ).prop('selected', true);
  }
  if (localStorage['expirationTimeDelta']) {
    $('select[name=expirationTimeDelta] option').prop('selected', false);
    $(
      "select[name=expirationTimeDelta] option[value='" +
        localStorage['expirationTimeDelta'] +
        "']"
    ).prop('selected', true);
  }
  if (localStorage['experienceLevel']) {
    $(
      'select[name=experienceLevel] option:contains(' +
        localStorage['experienceLevel'] +
        ')'
    ).prop('selected', true);
  }
  if (localStorage['projectLength']) {
    $(
      'select[name=projectLength] option:contains(' +
        localStorage['projectLength'] +
        ')'
    ).prop('selected', true);
  }
  if (localStorage['bountyType']) {
    $(
      'select[name=bountyType] option:contains(' +
        localStorage['bountyType'] +
        ')'
    ).prop('selected', true);
  }

  // fetch issue URL related info
  $('input[name=amount]').keyup(setUsdAmount);
  $('input[name=amount]').blur(setUsdAmount);
  $('input[name=usd_amount]').keyup(usdToAmount);
  $('input[name=usd_amount]').blur(usdToAmount);
  $('select[name=deonomination]').change(setUsdAmount);
  $('select[name=deonomination]').change(promptForAuth);
  $('input[name=issueURL]').blur(retrieveIssueDetails);
  setTimeout(setUsdAmount, 1000);
  waitforWeb3(function() {
    promptForAuth();
  });

  // revision action buttons
  $('#subtractAction').on('click', function() {
    var revision = parseInt($('input[name=revisions]').val());
  
    revision = revision - 1;
    if (revision > 0) {
      $('input[name=revisions]').val(revision);
    }
  });

  $('#addAction').on('click', function() {
    var revision = parseInt($('input[name=revisions]').val());
  
    revision = revision + 1;
    $('input[name=revisions]').val(revision);
  });

  if ($('input[name=issueURL]').val() != '') {
    retrieveIssueDetails();
  }
  $('input[name=issueURL]').focus();

  // all js select 2 fields
  $('.js-select2').each(function() {
    $(this).select2();
  });
  // removes tooltip
  $('.submit_bounty select').each(function(evt) {
    $('.select2-selection__rendered').removeAttr('title');
  });
  // removes search field in all but the 'denomination' dropdown
  $('.select2-container').click(function() {
    $('.select2-container .select2-search__field').remove();
  });
  // denomination field
  $('select[name=deonomination]').select2();
  if ($('input[name=amount]').val().trim().length > 0) {
    setUsdAmount();
  }


  $('#advancedLink a').click(function(e) {
    e.preventDefault();
    var target = $('#advanced_container');

    if (target.css('display') == 'none') {
      target.css('display', 'block');
      $(this).text('Advanced ⬆');
    } else {
      target.css('display', 'none');
      $(this).text('Advanced ⬇ ');
    }
  });

  $('#submitBounty').validate({
    submitHandler: function(form) {
      try {
        bounty_address();
      } catch (exception) {
        _alert(gettext('You are on an unsupported network.  Please change your network to a supported network.'));
        return;
      }

      var data = {};
      var disabled = $(form)
        .find(':input:disabled')
        .removeAttr('disabled');

      $.each($(form).serializeArray(), function() {
        data[this.name] = this.value;
      });

      disabled.attr('disabled', 'disabled');
      mixpanel.track('Submit New Bounty Clicked', {});

      // setup
      loading_button($('.js-submit'));
      var githubUsername = data.githubUsername;
      var issueURL = data.issueURL.replace(/#.*$/, '');
      var notificationEmail = data.notificationEmail;
      var amount = data.amount;
      var tokenAddress = data.deonomination;
      var token = tokenAddressToDetails(tokenAddress);
      var decimals = token['decimals'];
      var tokenName = token['name'];
      var decimalDivisor = Math.pow(10, decimals);
      var expirationTimeDelta = data.expirationTimeDelta;

      var metadata = {
        issueTitle: data.title,
        issueDescription: data.description,
        issueKeywords: data.keywords,
        githubUsername: data.githubUsername,
        notificationEmail: data.notificationEmail,
        fullName: data.fullName,
        experienceLevel: data.experienceLevel,
        projectLength: data.projectLength,
        bountyType: data.bountyType,
        tokenName
      };

      var privacy_preferences = {
        show_email_publicly: data.show_email_publicly,
        show_name_publicly: data.show_name_publicly
      };

      var expire_date =
        parseInt(expirationTimeDelta) + ((new Date().getTime() / 1000) | 0);
      var mock_expire_date = 9999999999; // 11/20/2286, https://github.com/Bounties-Network/StandardBounties/issues/25

      // https://github.com/ConsenSys/StandardBounties/issues/21
      var ipfsBounty = {
        payload: {
          title: metadata.issueTitle,
          description: metadata.issueDescription,
          sourceFileName: '',
          sourceFileHash: '',
          sourceDirectoryHash: '',
          issuer: {
            name: metadata.fullName,
            email: metadata.notificationEmail,
            githubUsername: metadata.githubUsername,
            address: '' // Fill this in later
          },
          schemes: {
            project_type: data.project_type,
            permission_type: data.permission_type
          },
          privacy_preferences: privacy_preferences,
          funders: [],
          categories: metadata.issueKeywords.split(','),
          created: (new Date().getTime() / 1000) | 0,
          webReferenceURL: issueURL,
          // optional fields
          metadata: metadata,
          tokenName: tokenName,
          tokenAddress: tokenAddress,
          expire_date: expire_date
        },
        meta: {
          platform: 'gitcoin',
          schemaVersion: '0.1',
          schemaName: 'gitcoinBounty'
        }
      };

      // validation
      var isError = false;

      $(this).attr('disabled', 'disabled');

      // save off local state for later
      localStorage['project_type'] = data.project_type;
      localStorage['permission_type'] = data.permission_type;
      localStorage['issueURL'] = issueURL;
      localStorage['amount'] = amount;
      localStorage['notificationEmail'] = notificationEmail;
      localStorage['githubUsername'] = githubUsername;
      localStorage['tokenAddress'] = tokenAddress;
      localStorage['expirationTimeDelta'] = $(
        'select[name=expirationTimeDelta]'
      ).val();
      localStorage['experienceLevel'] = $('select[name=experienceLevel]').val();
      localStorage['projectLength'] = $('select[name=projectLength]').val();
      localStorage['bountyType'] = $('select[name=bountyType]').val();
      localStorage.removeItem('bountyId');

      // setup web3
      // TODO: web3 is using the web3.js file.  In the future we will move
      // to the node.js package.  github.com/ethereum/web3.js
      var isETH = tokenAddress == '0x0000000000000000000000000000000000000000';
      var token_contract = web3.eth.contract(token_abi).at(tokenAddress);
      var account = web3.eth.coinbase;

      amount = amount * decimalDivisor;
      // Create the bounty object.
      // This function instantiates a contract from the existing deployed Standard Bounties Contract.
      // bounty_abi is a giant object containing the different network options
      // bounty_address() is a function that looks up the name of the network and returns the hash code
      var bounty = web3.eth.contract(bounty_abi).at(bounty_address());
      // StandardBounties integration begins here
      // Set up Interplanetary file storage
      // IpfsApi is defined in the ipfs-api.js.
      // Is it better to use this JS file than the node package?  github.com/ipfs/

      ipfs.ipfsApi = IpfsApi({
        host: 'ipfs.infura.io',
        port: '5001',
        protocol: 'https',
        root: '/api/v0'
      });
      ipfs.setProvider({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        root: '/api/v0'
      });

      // setup inter page state
      localStorage[issueURL] = JSON.stringify({
        timestamp: null,
        dataHash: null,
        issuer: account,
        txid: null
      });

      function syncDb() {
        // Need to pass the bountydetails as well, since I can't grab it from the
        // Standard Bounties contract.
        dataLayer.push({ event: 'fundissue' });

        // update localStorage issuePackage
        var issuePackage = JSON.parse(localStorage[issueURL]);

        issuePackage['timestamp'] = timestamp();
        localStorage[issueURL] = JSON.stringify(issuePackage);

        _alert({ message: gettext('Submission sent to web3.') }, 'info');
        setTimeout(function() {
          delete localStorage['issueURL'];
          mixpanel.track('Submit New Bounty Success', {});
          document.location.href = '/funding/details/?url=' + issueURL;
        }, 1000);
      }

      // web3 callback
      function web3Callback(error, result) {
        if (error) {
          mixpanel.track('New Bounty Error', {
            step: 'post_bounty',
            error: error
          });
          console.error(error);
          _alert(
            {
              message:
                gettext('There was an error.  Please try again or contact support.')
            },
            'error'
          );
          unloading_button($('.js-submit'));
          return;
        }

        // update localStorage issuePackage
        var issuePackage = JSON.parse(localStorage[issueURL]);

        issuePackage['txid'] = result;
        localStorage[issueURL] = JSON.stringify(issuePackage);

        // sync db
        syncDb();
      }

      function newIpfsCallback(error, result) {
        if (error) {
          mixpanel.track('New Bounty Error', {
            step: 'post_ipfs',
            error: error
          });
          console.error(error);
          _alert({
            message: gettext('There was an error.  Please try again or contact support.')
          });
          unloading_button($('.js-submit'));
          return;
        }

        // cache data hash to find bountyId later
        // update localStorage issuePackage
        var issuePackage = JSON.parse(localStorage[issueURL]);

        issuePackage['dataHash'] = result;
        localStorage[issueURL] = JSON.stringify(issuePackage);

        // bounty is a web3.js eth.contract address
        // The Ethereum network requires using ether to do stuff on it
        // issueAndActivateBounty is a method defined in the StandardBounties solidity contract.

        var eth_amount = isETH ? amount : 0;
        var _paysTokens = !isETH;
        var bountyIndex = bounty.issueAndActivateBounty(
          account, // _issuer
          mock_expire_date, // _deadline
          result, // _data (ipfs hash)
          amount, // _fulfillmentAmount
          0x0, // _arbiter
          _paysTokens, // _paysTokens
          tokenAddress, // _tokenContract
          amount, // _value
          {
            // {from: x, to: y}
            from: account,
            value: eth_amount,
            gasPrice: web3.toHex($('#gasPrice').val() * Math.pow(10, 9)),
            gas: web3.toHex(318730),
            gasLimit: web3.toHex(318730)
          },
          web3Callback // callback for web3
        );
      }

      var do_bounty = function(callback) {
        // Add data to IPFS and kick off all the callbacks.
        ipfsBounty.payload.issuer.address = account;
        ipfs.addJson(ipfsBounty, newIpfsCallback);
      };

      do_bounty();
    }
  });
});
