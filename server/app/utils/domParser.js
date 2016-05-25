var cheerio = require('cheerio');

var STYLE =
`<style type="text/css">
  .elem-highlight:hover{
    border: solid red !important;
  }
</style>`;

var SCRIPT =
`<script type="text/javascript">
  $(function() {
        $(".elem-highlight").on("click", function(e) {
          e.preventDefault();
          var selector = $(this)
            .parents()
            .map(function() { return this.tagName; })
            .get()
            .reverse()
            .concat([this.nodeName])
            .join(">");

          var id = $(this).attr("id");
          if (id) {
            selector += "#"+ id;
          }

          var classNames = $(this).attr("class");
          if (classNames) {
            selector += "." + $.trim(classNames).replace(/\s/gi, ".");
          }
          var data = $(this).text();
          var link;
          var firstChild = $($(this).children()[0]);
          if (firstChild.prop('tagName')==='IMG')
            data = firstChild.attr('src');
          if (firstChild.prop('tagName')==='A')
            link = firstChild.attr('href');
          var rtn = {name: selector, data: data, link: link};
          window.parent.messenger.set(rtn);
          //alert(selector);
      });
    });
</script>`;

var SELECTOR =
`<div class="elem-highlight"></div>`;

function inject(html){
  var $ = cheerio.load(html);
  //Grab text and image elements
  var elements = $('span,a, p, h3, img');
  elements.each(function(elem){
    $(this).wrap(SELECTOR);
  });
  //inject css
  $('head').append(STYLE);
  $('body').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>');
  $('body').append(SCRIPT);

  return $.html();
}
module.exports = inject;
