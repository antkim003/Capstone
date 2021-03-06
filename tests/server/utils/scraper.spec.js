var expect = require('chai').expect,
  Scraper = require('../../../server/app/utils/scraper_old');

xdescribe('basic functionality', function(){
  this.timeout(20000);
  xit('gets first 3 pages of results from google using lib', function(done){
    var scraper = new Scraper("https://www.google.com", "div.g h3.r" );
    scraper.go(null,[
      {fn: 'type', params: ["input[name='q']",'horseman']},
      {fn: 'click', params: ["input[name='btnK']"]}
    ], {num: 3, selector: '#pnnext'})
    .then(function(data){
      console.log(data);
      done();
    })
    .catch(function(err){
      console.log(err);
    });
  });
  it('gets stories from msnbc', function(done){
    var scraper = new Scraper('http://www.msnbc.com', 'h2.featured-slider__teaser__title');
    scraper.go(10000)
    .then(function(data){
      console.log(data);
      done();
    });
  });
  //these next two might fail the first time, b/c of the way heroku hosts the apps
  xit('gets products from stackstore', function(done){
    var scraper = new Scraper("https://stackstore-teamwin.herokuapp.com", "div#product-pane");
    scraper.go(4000)
    .then(function(data){
        console.log(data);
        expect(data.length).to.equal(19);
        done();
    });
  });
  xit('gets products from northwind filter', function(done){
    var scraper = new Scraper("https://nwind-filter.herokuapp.com/products", '#iterm-row .col-md-12');
    scraper.go(4000,
      [{fn: 'click', params: ["span#letter:contains('A'):parent:eq(0)"]}],
      {num: 1, selector: '.pagination a:eq(1)' })
    .then(function(data){
      console.log(data);
      expect(data.length).to.equal(6);
      done();
    });
  });
});
