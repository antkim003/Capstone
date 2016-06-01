module.exports =
  function() {
    $(document).ready(function() {
      // event binders
      function bindMouseEnterEvent() {
        $('body').off('mouseenter').on('mouseenter', '*', function(ev) {
          $('body').find('*').removeClass('__activate');
          $(this).addClass('__activate');
          dataCompiler(ev.currentTarget);
        });
      }

      bindMouseEnterEvent();
      $('body').on('mouseleave', '*', function(ev) {
        bindMouseEnterEvent();
        $(this).removeClass('__activate');
      });

      $('body').on('click','*', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      });

      // data stuff
      // need to map out any given event handler to its current target
      // extract the contents into a json format...
      // all attributes will be come a key value pair
      // all inner elements will become content
      // send it on hover

      function dataCompiler(element) {
        var obj = {};
        obj['attributes'] = getAttributes(element);
        $.extend(obj, getContent(element), getSelectorPath(element));
        window.parent.messenger.set(obj); // sets to the window messenger object
      }

      function getAttributes(element) {
        // this compiles and gets all the attributes on given element
        var attributes = {};
        $.each(element.attributes, function( index, attr ) {
          if (attr.value) {
            attributes[attr.name] = attr.value;
          }
        });
        return attributes;
      }

      function getContent(element) {
        // gets the content from the element
        var content = {};
        var additionalTargets = [];
        var children = $(element).find('*');
        var innerHTML = "";
        console.log(children.length);
        if (children.length >= 6) {
          content['content'] = "Too many elements - narrow your search";
          return content;
        }
        if (children.length > 0) {
          for (var i = 0; i < children.length; i++) {
            // allow user to choose from each one
            if (children[i].innerHTML) {
              var target = 'target' + (i+1);
              var obj = {};
              obj[target] = children[i].textContent;
              additionalTargets.push(obj);  
            }
            innerHTML += children[i].textContent;
          }  
        } else {
          // no children
          innerHTML += element.innerHTML;
        }
        content['content'] = innerHTML;
        content['additionalTargets'] = additionalTargets;
        return content;
      }

      function getSelectorPath(element) {
        var selector = $(element).first().parentsUntil("html").andSelf().map(function(){
              return this.tagName;
            }).get().join(">");

        var id = $(element).attr("id");
        if (id) {
          selector += "#"+ id;
        }

        var classNames = $(element).attr("class");
        if (classNames) {
          selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }
        return {selector: selector};
      }

    });
};
