var generateRandomString = function(stringLength) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var randomstring = '';
  for (var i=0; i<stringLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
};

var createPlaceholder = function(elt, instanceClassID) {
  // custom element to avoid conflict with potential existing CSS rules
  var placeholder = document.createElement("phdr");
  placeholder.classList.add('jetblocked');

  // copy information from the plugin object
  var embedComputedStyle = window.getComputedStyle(elt, null);

  placeholder.style.width = embedComputedStyle.width;
  placeholder.style.height = embedComputedStyle.height;

  placeholder.style.minWidth = embedComputedStyle.minWidth;
  placeholder.style.minHeight = embedComputedStyle.minHeight;

  placeholder.style.marginTop = embedComputedStyle.marginTop;
  placeholder.style.marginLeft = embedComputedStyle.marginLeft;
  placeholder.style.marginBottom = embedComputedStyle.marginBottom;
  placeholder.style.marginRight = embedComputedStyle.marginRight;

  placeholder.style.display = embedComputedStyle.display;
  // Inline elements can't have height and width. So we use inline-block instead.
  if (placeholder.style.display == "inline") {
      placeholder.style.display = "inline-block";
  }

  placeholder.style.position = embedComputedStyle.position;

  placeholder.style.overflow = embedComputedStyle.overflow;
  placeholder.style.visibility = embedComputedStyle.visibility;

  placeholder.style.backgroundColor = "gray";
  placeholder.style.background = "gray";
  
  // Put a svg instead
  placeholder.textContent = "Plugin";
  
  // add a way to know that 
  elt.classList.add('jetblock-whitelist');
  elt.classList.add(instanceClassID);
  placeholder.pluginSource = elt;

  placeholder.onmouseover = function() {
    this.style.cursor = "pointer";
  };

  placeholder.onclick = function() {
    this.parentNode.replaceChild(this.wrappedJSObject.pluginSource, this);
  };

  return placeholder;
};

var instanceClassID = generateRandomString(8);

var htmlMutation = function(e) {
  var nodes = document.querySelectorAll('object:not(.'+instanceClassID+'), embed:not(.'+instanceClassID+')');
  if (nodes) {
    for(var i = 0, l = nodes.length; i < l; i++) {
      var current = nodes[i];
      // Generate a placeholder
      var placeholder = createPlaceholder(current, instanceClassID);
      current.parentNode.replaceChild(placeholder, current);
    };
  }
};

var documentMutation = document.addEventListener('DOMNodeInserted', function() {
  if (htmlMutation) {
    document.addEventListener('DOMSubtreeModified', htmlMutation, false);
    htmlMutation = null;
  }
  document.removeEventListener(documentMutation);
}, false);