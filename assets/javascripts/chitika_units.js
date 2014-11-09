var AdUnitComponent = Ember.Component.extend({
  didInsertElement: function() {
  
  // window.CHITIKA = undefined;
  // window.CHITIKA_ADS = undefined;

    // var rand = Math.floor((Math.random() * 1000) + 1);
    // var chitika_js = document.createElement('script');
    // chitika_js.type = 'text/javascript';
    // chitika_js.async = true;
    // chitika_js.src = '//cdn.chitika.net/getads.js?ra='+rand;
    // this.$().html(chitika_js);

    // if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
    // var unit = {"calltype":"async[2]","publisher":"forumautomation","width":728,"height":90,"sid":"Chitika Default"};
    // placement_id = window.CHITIKA.units.length;
    // block_id = "chitikaAdBlock-"+placement_id;
    // window.CHITIKA.units.push(unit);
        // this.$().append("<div id='" + block_id + "' class='chitika'></div>");
    this.$().html('<script type="text/javascript">( function() { if (window.CHITIKA === undefined) { window.CHITIKA = { \'units\' : [] }; }; var unit = {"calltype":"async[2]","publisher":"forumautomation","width":728,"height":90,"sid":"Chitika Default"}; var placement_id = window.CHITIKA.units.length; window.CHITIKA.units.push(unit); document.write(\'<div id="chitikaAdBlock-\' + placement_id + \'"></div>\'); }()); </script> <script type="text/javascript" src="//cdn.chitika.net/getads.js" async></script>');

  }
});

var AdMixinFactory = function(insertFunction) {
  return Ember.Mixin.create({
    injectAd: function() {
      var adUnit = this.createChildView(AdUnitComponent);
      this.set('chAdUnit', adUnit);
      var self = this;
      adUnit._insertElementLater(insertFunction(this, adUnit));
    }.on('didInsertElement'),

    removeAd: function() {
      if (this.get('chAdUnit')) {
        this.get('chAdUnit').destroy();
        this.set('chAdUnit', null);
      }
    }.on('willClearRender')
  });
};

var PrependAdMixin = AdMixinFactory(function(self, adUnit) {
  return function() { 
    self.$().prepend(adUnit.$()); 
  };
});

var AfterAdMixin = AdMixinFactory(function(self, adUnit) {
  return function() { 
    self.$().append(adUnit.$());
  };
});

var BeforeAdMixin = AdMixinFactory(function(self, adUnit) {
  return function() { 
    self.$().before(adUnit.$()); 
  };
});

var AfterUserAboutAdMixin = AdMixinFactory(function(self, adUnit) {
  return function() {
   self.$(".user-main .about").after(adUnit.$()); 
  };
});

Discourse.SelectedPostsView.reopen(BeforeAdMixin);
// Discourse.DiscoveryTopicsView.reopen(PrependAdMixin);
// Discourse.TopicFooterButtonsView.reopen(AfterAdMixin);
Discourse.UserView.reopen(AfterUserAboutAdMixin);