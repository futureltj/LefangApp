/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/dashboard'],
  function (oj, ko, $, dash) {

    function AboutViewModel() {
      var self = this;

      self.buttonClick2 = function (event) {
        oj.Router.rootInstance.go('dashboard');
      }

      var colorHandler = new oj.ColorAttributeGroupHandler();
      colorHandler.addMatchRule("high", '#ed6647');
      colorHandler.addMatchRule("low", '#267db3');

      /* chart data */
      var hiTemps = [
        18, 14, 37, 18, 36, 44, 59, 65, 62, 50, 38, 95, 94, 57, 64,
        39, 42, 45, 42, 44, 19, 44, 37, 36, 36, 44, 47, 46, 59, 50];
      var lowTemps = [19, 2, 2, 2, 24, 29, 9, 7, 19, 18, 34, 37, 31, 44, 35, 33, 33, 32, 30, 26, 11, 7,
        6, 7, 15, 16, 21, 13, 15, 16, 22, 32, 31, 27, 23, 24, 19, 19, 18, 21, 20, 14, 8, 21, 29, 27, 23, 14, 14,
        21, 33, 34, 34, 34, 24, 22, 16, 12, 10, 16, 30, 16, 12, 20, 11, 16, 27, 30, 28, 34, 37, 18, 16, 38, 23,
        16, 20, 27, 37, 34, 28, 22, 17, 21, 24, 21, 35, 39, 36, 34, 34, 37, 34, 37, 38, 35, 38, 43, 41, 34, 48,
        49, 45, 57, 41, 31, 32, 31, 37, 39, 36, 47, 46, 42, 43, 42, 41, 42, 42, 41, 44, 50, 50, 50, 50, 47, 47,
        48, 50, 57, 62, 52, 46, 46, 57, 59, 58, 52, 52, 53, 52, 51, 52, 52, 52, 55, 50, 44, 43, 48, 52, 51, 56,
        57, 55, 57, 57, 61, 67, 66, 59, 58, 59, 59, 58, 58, 62, 62, 68, 67, 61, 57, 59, 59, 60, 66, 60, 59, 59,
        62, 64, 69, 73, 69, 64, 59, 66, 69, 73, 73, 66, 63, 62, 68, 71, 71, 69, 67, 65, 63, 61, 61, 63, 71, 63,
        62, 64, 66, 65, 64, 63, 62, 65, 62, 62, 62, 70, 70, 64, 61, 65, 66, 65, 64, 64, 62, 60, 61, 64, 62, 59,
        59, 60, 63, 61, 63, 67, 64, 67, 64, 59, 58, 67, 72, 71, 72, 66, 67, 69, 63, 59, 61, 60, 62, 56, 53, 52,
        48, 55, 54, 55, 46, 47, 63, 53, 50, 54, 53, 54, 60, 60, 57, 56, 56, 51, 48, 53, 49, 43, 55, 58, 50, 51,
        47, 44, 45, 57, 61, 60, 57, 55, 43, 39, 49, 50, 48, 46, 46, 47, 46, 45, 52, 46, 45, 39, 34, 36, 45, 47,
        46, 39, 35, 40, 37, 42, 46, 38, 33, 30, 29, 37, 27, 24, 31, 27, 24, 42, 42, 48, 33, 31, 27, 23, 32, 39,
        33, 37, 30, 26, 38, 21, 18, 29, 38, 32, 31, 32, 33, 32, 35, 41, 36, 29, 27, 30, 33, 42, 41, 44, 37, 38,
        40, 30, 22, 20];

      // Function to create the histogram data
      var createHistogramData = function (values, numBuckets, minValue, maxValue) {

        var items = [];
        var ratio = (maxValue - minValue) / numBuckets;
        for (var i = 0; i < numBuckets; i++) {
          items.push(0);
        }

        for (var j = 0; j < values.length; j++) {
          items[Math.floor(values[j] / ratio)]++;
        }
        return items;
      };

      // Data for the bar chart
      var barHighsSeries = [{ name: "Highs Frequency", items: createHistogramData(hiTemps, 5, 0, 100), color: colorHandler.getValue("high") }];
      var barLowsSeries = [{ name: "Lows Frequency", items: createHistogramData(lowTemps, 5, 0, 100), color: colorHandler.getValue("low") }];
      var barGroups = [];
      for (var i = 0; i < 5; i++) {
        barGroups.push((i * 20 + 1) + "-" + (i + 1) * 20);
      }

      this.barHighsSeriesValue = ko.observableArray(barHighsSeries);
      this.barLowsSeriesValue = ko.observableArray(barLowsSeries);
      this.barGroupsValue = ko.observableArray(barGroups);

      var lineSeries = [
      { name: "Low", items: lowTemps, color: colorHandler.getValue("low") }];
      var lineGroups = [];
      for (var i = 0; i < 30; i++) {
        lineGroups.push(new Date(1519833600000 + 86400000 * i).toISOString());
      }
      this.lineSeriesValue = ko.observableArray(lineSeries);
      this.lineGroupsValue = ko.observableArray(lineGroups);

      /* create legend */
      this.legendSections = [{
        items: [
        { color: colorHandler.getValue("low"), text: "Low", id: "low" }]
      }];


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
      self.connected = function () {
        // Implement if needed
        var month="";
        if(dash.selectedItemsValue().length>0){
          var tmp = dash.selectedItemsValue()[0]
          if(tmp.indexOf(";")>0){
            month = tmp.split(";")[1];
            month = month.trim()
          }
        }
        if(month=="四月"){
          month="4"
        }
        if(month=="三月"){
          month="3"
        }
        if(month=="二月"){
          month="2"
        }
        if(month=="一月"){
          month="1"
        }
        console.log("当前月份："+month)
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };

      
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new AboutViewModel();
  }
);
