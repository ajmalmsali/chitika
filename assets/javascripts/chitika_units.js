var AdUnitComponent = Ember.Component.extend({
  didInsertElement: function() {
  
    if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; };
    // if(window.CHITIKA_ADS !== undefined){ 
    //   console.log("!!undefined");
    //   //window.CHITIKA_ADS.url_data_cache = null;
      


      // try {
      //     if (window.CHITIKA &&
      //         top.CHITIKA &&
      //         top.CHITIKA !== window.CHITIKA) {
      //         top.CHITIKA.units = top.CHITIKA.units.append(window.CHITIKA.units);
      //         delete(window.CHITIKA);
      //     }
      //     window.CHITIKA = window.CHITIKA ? window.CHITIKA : top.CHITIKA;
      //     window.CHITIKA_ADS = window.CHITIKA_ADS ? window.CHITIKA_ADS : top.CHITIKA_ADS;
      // } catch (e) {}

      // window.CHITIKA_ADS.make_it_so();
      // window.CHITIKA_ADS.append_func(window, 'load', CHITIKA_ADS.make_it_so);
    if(window.CHITIKA_ADS !== undefined){ 

      window.CHITIKA_ADS.get_url_data = function() {
        
        var frm, ref, serveUrl, url;
        // Detect iframes and pass appropriate frm & url values
            frm             = document.location.href;
            url             = document.location.href;
            ref             = document.location.href;
            serveUrl        = document.location.href;

        if (serveUrl &&
            serveUrl.match(/^javascript:/)) {
            serveUrl = undefined;
        }

        if (ref &&
            ref.length > 500) {
            ref = ref.replace(/[?#].*/, '');
            if (ref.length > 500) {
                ref = ref.match(/.*\/\/[^\/]*\//)[0];
            }
        }

        url_data_cache = {
            frm         : frm,
            url         : url,
            ref         : ref,
            serveUrl    : serveUrl
        };
        return url_data_cache;
      }

    }
    else{
      var unit = {"calltype":"async[2]","publisher":"forumautomation","width":728,"height":90,"sid":"Chitika Default","query":"google"};
      placement_id = window.CHITIKA.units.length;
      block_id = "chitikaAdBlock-"+placement_id;
      window.CHITIKA.units.push(unit);
      this.$().html('<script type="text/javascript" src="http://cdn.chitika.net/getads.js" async></script>'+"<div id='" + block_id + "' class='chitika'></div>"+
        '<script type="text/javascript">'+
        'var infolinks_pid = 195026;'+
        'var infolinks_wsid = 3;'+
</script>
<script type="text/javascript" src="http://resources.infolinks.com/js/infolinks_main.js"></script>');
    }
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