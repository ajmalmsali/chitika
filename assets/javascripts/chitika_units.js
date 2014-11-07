(function(){
  var chitika_js = document.createElement('script');
     chitika_js.type = 'text/javascript';
     chitika_js.async = true;
     chitika_js.src = '//cdn.chitika.net/getads.js';
  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(chitika_js);
})();

var AdUnitComponent = Ember.Component.extend({

  placementId: function(){ 
    if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
    var unit = {"calltype":"async[2]","publisher":"forumautomation","width":728,"height":90,"sid":"Chitika Default"};
    placement_id = window.CHITIKA.units.length;
    block_id = "chitikaAdBlock-"+placement_id;
    return block_id;
  },

  didInsertElement: function() {
    this.$().html("<div id='" + this.get('placementId') + "' class='chitika'>here goes ad</div>");
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

Discourse.DiscoveryTopicsView.reopen(PrependAdMixin);
Discourse.TopicFooterButtonsView.reopen(AfterAdMixin);
Discourse.UserView.reopen(AfterUserAboutAdMixin);