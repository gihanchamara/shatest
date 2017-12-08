(function () {
  Polymer({
    is: 'og-app',

    properties: {

      appHeader: {
        type: String
      },

      routesActive: {
        type: Boolean,
        value: false
      },

      //Global application object
      global: {
        type: Object,
        value: function () {
          return {
            version: '1.0',
            name: 'OG App'
          }
        }
      },

      navItems: {
        type: Array,
        value: function () {
          return [{
            "label": "Dashboard",
            "id": "dashboard",
            "path": "/dashboard",
            "icon": "px-fea:dashboard"
          }, {
            "label": "Alerts",
            "id": "alerts",
            "path": "#",
            "icon": "px-fea:alerts"
          }, {
            "path": "#",
            "icon": "px-fea:cases",
            "label": "Cases",
            "id": "cases"
          }, {
            "path": "#",
            "icon": "px-fea:analysis",
            "label": "Analysis",
            "id": "analysis"
          }]
        }
      },

      footerLinks: {
        type: Array,
        value: function () {
          return []
        }
      }
    },

    observers: ['_routeChanged(_route)'],

    ready: function () {
      this._checkForDefaultRoute();
      this.$.configAjaxEl.addEventListener('response', function (evt) {
        // We're getting some global config from the server.
        // console.log('config', evt.detail.response);
        this.appHeader = evt.detail.response.appHeader;
        this.$.dashboardPxView.elementData = evt.detail.response;
      }.bind(this));
    },

    _checkForDefaultRoute: function () {
      // set default route to /rmd
      var l = window.location;
      if ((l.hash === "#/" || l.hash === "") && l.pathname === "/") {
        l.hash = "/dashboard";
      }
    },

    _routeChanged: function (newRoute) {}

  });
})()