/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojlegend', 'ojs/ojchart','ojs/ojselectcombobox'],
 function(oj, ko, $) {
  
    function IncidentsViewModel() {
      var self = this;

      this.val = ko.observable("4");
      this.valueChangedHandler = function (event) {
        console.log(event.detail.value);
      }

      var data = {
        "January" :  [39,42,42,56,49,22,23,21,33,23,37,39,36,32,35,43,32,42,42,40,36,40,39,39,42,31,30,34,36,38,26],
        "February" :  [36,34,26,43,42,27,40,37,29,40,34,40,21,32,25,21,27,33,27,19,32,43,38,24,37,32,30,29],
        "March": [31,39,37,45,40,27,38,49,54,53,59,47,43,51,44,52,57,39,43,38,47,43,38,45,49,62,46,40,46,54,47],
        "April": [51,67,64,60,61,63,62,45,43,56,57,66,68,65,72,64,71,80,64,57,65,69,52,52,62,64,62,71,78,67]};
        var colorHandler = new oj.ColorAttributeGroupHandler();
        var legendItems = [];
        var temp = ["-10～-5°C","-5～0°C","0～5°C","5～10°C","10～15°C","15～20°C","20～25°C","≥26°C"];
        var colors = ["267db3", "66a3c9","47bdef", "6ddbdb", "a2bf39", "fad55c", "ffb54d", "ed6647"];
  
        var getPictoItems = function (month, monthIndex){
          var pictoItems = [];
          var values = data[month];
          var firstDay = (new Date(2015, monthIndex, 1)).getDay();
          var pointer = 0;
          for (var i = 0; i < values.length; i++) {
            var val = values[i];
            if(pointer < firstDay){
              pictoItems.push({name: '', color: 'rgba(0,0,0,0)'});
              pointer++;
              i--;
            }
            else
              pictoItems.push({name: month+' '+(i+1)+" ("+val+"°C)", color: "#"+colors[Math.floor(val/10)-1]});
          }
          return pictoItems;
        }
  
        for (var i = 0; i < temp.length; i++) {
          legendItems.push({text: temp[i] , color: "#"+colors[i]});
        };
  
        this.janItems = ko.observableArray(getPictoItems('January', 0));
        this.febItems = ko.observableArray(getPictoItems('February', 1));
        this.marItems = ko.observableArray(getPictoItems('March', 2));
        this.aprilItems = ko.observableArray(getPictoItems('April', 3));
        this.legendSections = ko.observableArray([{items: legendItems}]);
  
        this.tooltipFunction = function (dataContext) {
          return {'insert':dataContext.name};
        }


            var colorHandler = new oj.ColorAttributeGroupHandler();

            /* chart data */
            var mathScores = [80, 80, 85, 68, 65, 77, 73, 75, 63, 68, 69, 65, 59, 57, 61];
            var engScores = [51, 47, 56, 49, 48, 59, 59, 58, 58, 62, 66, 79, 74, 78, 85];

            // Function to create the histogram data
            var createRangeData = function (values) {
              var items = [];
              for (var i = 0; i < values.length; i++) {
                items.push({low: values[i] - (5 + Math.random() * 10), high: values[i] + 5 + Math.random() * 10});
              }
              return items;
            };

            var lineSeries = [{name: "Math Scores", items: mathScores, categories: ['math'], color: colorHandler.getValue("math")},
              {name: "English Scores", items: engScores, categories: ['english'], color: colorHandler.getValue("english")}];
            var lineGroups = [];
            for (var i = 0; i < mathScores.length; i++) {
              lineGroups.push(i + 1);
            }
            this.lineSeriesValue = ko.observableArray(lineSeries);
            this.lineGroupsValue = ko.observableArray(lineGroups);

            var yAxis = {title: 'Test Score', referenceObjects: [
                {text: 'Math Range', type: 'area', items: createRangeData(mathScores), categories: ['math'],
                  color: 'rgba(38, 125, 179,0.5)', displayInLegend: 'off', location: 'back'},
                {text: 'English Range', type: 'area', items: createRangeData(engScores), categories: ['english'],
                  color: 'rgba(104,193,130,0.5)', displayInLegend: 'off', location: 'back'}
              ]};

            this.yAxisData = ko.observable(yAxis);
            this.hiddenCategoriesValue = ko.observableArray([]);
            this.highlightedCategoriesValue = ko.observableArray([]);

            /* create legend */
            this.legendSections2 = [{items: [{color: colorHandler.getValue("math"), text: "Math Scores", id: "math"},
                            {color: colorHandler.getValue("english"), text: "English Scores", id: "english"}]}];
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
    return new IncidentsViewModel();
  }
);
