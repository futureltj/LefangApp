/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojinputnumber', 'ojs/ojtoolbar', 'ojs/ojvalidation-number'],
 function(oj, ko, $) {
  
    function DashboardViewModel() {
      var self = this;

      self.stackValue = ko.observable('off');
        self.dualY = ko.observable('on');
        self.orientationValue = ko.observable('vertical');
        self.splitterValue = ko.observable(0.5);
        
        /* chart data */
var dualYSeries = [{name: "2016年", items: [640+560, 960+420, 584+511, 4600+386]},
       {name: "2017年", items: [650+420, 620+420, 490+420, 3200+560]},
       {name: "2018年", items: [540, 743, 1474, 3322]},
       {name: "v2016环比升降幅(%)", items: [(540-640-560)/(640+560), (743-960-420)/(960+420), (1474-584-511)/(584+511), (3322-4600-386)/(4600+386)], assignedToY2: "on"},
       {name: "v2017环比升降幅(%)", items: [(540-650-420)/(650+420), (743-620-420)/(620+420), (1474-490-420)/(490+420), (3322-3200-560)/(3200+560)], assignedToY2: "on"}];
       
var dualYSeries2 = [{name: "2016年", items: [640+560, 960+420, 584+511, 4600+386]},
       {name: "2017年", items: [650+420, 620+420, 490+420, 3200+560]},
       {name: "2018年", items: [540, 743, 1474, 3322]},
       {name: "v2016同比升降幅(%)", items: [(540-640-560)/540, (743-960-420)/743, (1474-584-511)/1474, (3322-4600-386)/3322], assignedToY2: "on"},
       {name: "v2017同比升降幅(%)", items: [(540-650-420)/540, (743-620-420)/743, (1474-490-420)/1474, (3322-3200-560)/3322], assignedToY2: "on"}];

        var dualYGroups = ["一月", "二月", "三月", "四月"];
        self.barSeriesValue = ko.observableArray(dualYSeries);
        self.barGroupsValue = ko.observableArray(dualYGroups);
        var converterFactory = oj.Validation.converterFactory('number');
        var decimalConverter = converterFactory.createConverter({minimumFractionDigits: 2, maximumFractionDigits: 2});
        var percentConverter = converterFactory.createConverter({style: 'percent'});
        self.yAxisConverter = ko.observable(percentConverter);
        
        /* toggle buttons*/
        self.dualYOptions = [
            {id: 'on', label: 'on', value: 'on'},
            {id: 'off', label: 'off', value: 'off'}
        ];
        self.updateDualY = function(event) {
            document.getElementById('splitterPosition').disabled = (event.detail.value === 'off');
        };
        
      self.drinkValues = [
          {id: 'tong', label: '同比'},
          {id: 'huan',    label: '环比'},
      ];
      self.button2Text=ko.observable('huan');

      self.buttonClick = function(event) {
        if(event.detail.value==='tong'){
          self.barSeriesValue(dualYSeries2);
        }else{
          self.barSeriesValue(dualYSeries);
        }
      };
      self.selectedItemsValue=ko.observable([])
      self.selectionListener = function(event) {
        var eventInfo = '';
        var detail = event.detail;
        console.log(detail)
        console.log(self.selectedItemsValue())
        oj.Router.rootInstance.go('about');
      }

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here. 
       * This method might be called multiple times - after the View is created 
       * and inserted into the DOM and after the View is reconnected 
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
