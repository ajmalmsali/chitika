var AdUnitComponent = Ember.Component.extend({
  didInsertElement: function() {
  
    if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
    var unit = {"calltype":"async[2]","publisher":"forumautomation","width":728,"height":90,"sid":"Chitika Default"};
    placement_id = window.CHITIKA.units.length;
    block_id = "chitikaAdBlock-"+placement_id;
    window.CHITIKA.units.push(unit);
    this.$().html('<script type="text/javascript" src="http://cdn.chitika.net/getads.js" async></script>'+"<div id='" + block_id + "' class='chitika'></div>"+
      '<script type="text/javascript">'+
      'var infolinks_pid = 195026;'+
      'var infolinks_wsid = 3;'+
      '</script>'+
      '<script type="text/javascript" src="http://resources.infolinks.com/js/infolinks_main.js"></script>');

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
Discourse.TopicFooterButtonsView.reopen(AfterAdMixin);
Discourse.UserView.reopen(AfterUserAboutAdMixin);