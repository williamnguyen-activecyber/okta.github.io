(function($) {    
  $(function() {
    // Once the page is loaded, find the hidden iframe element
    // and make a postMessage request

    var iframe = $('<iframe id="myOktaIFrame" src="https://login.okta.com/discovery/iframe.html" style="display:none"></iframe>').get(0);

    $('body').append(iframe);

    $('#myOktaIFrame').load(function() {
      iframe.contentWindow.postMessage({messageType: 'get_accounts_json'}, 'https://login.okta.com');
    });
    window.addEventListener('message', receiveMessage, false);
  });

  function receiveMessage(event) {
    // Verify the event origin is trusted
    if (event.origin !== 'https://login.okta.com' || !event.data) {
      return;
    }

    function findPreviewOrg(accounts) {
      // Extract the first 'oktapreview' domain
      for (i = 0; i < accounts.length; i++) {
        if (accounts[i].origin.indexOf('.oktapreview.com') !== -1){
          return accounts[i].origin;
        }
      }
      return 'https://{yourOktaDomain}.com';
    }

    var previewOrg = findPreviewOrg(event.data);

    // Replace all occurances of 'https://{yourOktaDomain}.com with
    // the last used oktapreview account: 'https://dev-{number}.oktapreview.com
    $('.okta-preview-domain').text(previewOrg);
  }
})(jQuery); 
