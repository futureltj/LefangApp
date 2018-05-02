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


      var high = {
        "二月" :  [6,7,2,4,5,4,7,6,10,8,9,7,12,17,9,11,11,11,9,9,9,15,15,13,11,13,16,15],
        "三月": [14,12,18,24,10,11,10,11,11,14,17,20,24,23,20,11,13,15,11,10,9,15,19,21,22,22,23,25,24,20,22],
        "四月": [27,24,24,16,16,16,14,21,26,29,29,21,20,18,20,21,21,24,27,27,26,28,24,16,22,22,27,26,23,31]};
      var low = {
        "二月" :  [1,-2,-3,-3,-2,-2,-1,1,4,0,-1,0,3,7,5,3,6,7,6,6,5,4,6,8,4,6,12,8],
        "三月": [7,7,11,7,7,7,7,3,4,6,8,13,14,16,9,9,10,10,7,6,5,8,10,13,13,13,14,14,14,13,14],
        "四月": [16,17,17,12,11,7,7,12,16,17,16,15,15,12,10,10,12,14,16,17,19,20,13,12,13,15,15,18,19,22]};
        var colorHandler = new oj.ColorAttributeGroupHandler();
        var legendItems = [];
        var temp = ["-10～-5°C","-5～0°C","0～5°C","5～10°C","10～15°C","15～20°C","20～25°C","≥26°C"];
        var colors = ["267db3", "66a3c9","47bdef", "6ddbdb", "a2bf39", "fad55c", "ffb54d", "ed6647"];
  
        var getPictoItems = function (month, monthIndex){
          var pictoItems = [];
          var h_values = high[month];
          var l_values = low[month];
          var firstDay = (new Date(2018, monthIndex, 1)).getDay();
          var pointer = 0;
          for (var i = 0; i < h_values.length; i++) {
            var high_val = h_values[i];
            var low_val = l_values[i];
            if(pointer < firstDay){
              pictoItems.push({name: '', color: 'rgba(0,0,0,0)'});
              pointer++;
              i--;
            }
            else
              pictoItems.push({shape: 'circle', name: month+' '+(i+1)+"日 <br>最<b style='color:red'>高</b>气温 "+high_val+"°C <br>最<b style='color:blue'>低</b>气温 "+low_val+"°C", color: "#"+colors[Math.floor((high_val+low_val)/10)+2]});
          }
          return pictoItems;
        }
  
        for (var i = 0; i < temp.length; i++) {
          legendItems.push({text: temp[i] , color: "#"+colors[i]});
        };
  
        this.febItems = ko.observableArray(getPictoItems('二月', 1));
        this.marItems = ko.observableArray(getPictoItems('三月', 2));
        this.aprItems = ko.observableArray(getPictoItems('四月', 3));
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
