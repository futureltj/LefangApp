/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart'],
 function(oj, ko, $) {
  
    function CustomerViewModel() {
      var self = this;

      var generateRandomServerData = function(start, interval, numGroups, numSeries) {
        var data = {'groups': [], 'series': []};
        var time, s, g;
        
        for (s = 0; s < numSeries; s++) {
          data['series'].push({'name': "Server " + (s+1), 'items': []});
          for (var g = 0; g < numGroups; g++) {
            var randomValue = (Math.random() + Math.random()) / (s+1);
            data['series'][s]['items'].push(randomValue);
          }
        }
  
        for (g = 0; g < numGroups; g++) {
          time = new Date(start + g*interval).toISOString();
          data['groups'].push(time);
        }
  l
        return data;
      }
      
      /**
       * Generates a random count data
       * @param {Number} start The start time
       * @param {Number} interval The interval between data points
       * @param {Number} numGroups Number of groups
       * @return {Object} Data object containing random data
       */
      var generateRandomCountData = function(start, interval, numGroups) {
        var data = {'groups': [], 'series': []};
        var time, s, g;
        
        data['series'].push({'name': "Good", 'color': "#68c182", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(Math.random() + Math.random() * 500);
          data['series'][0]['items'].push(randomValue);
        }
        
        data['series'].push({'name': "Warning", 'color': "#fad55c", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(Math.random() + Math.random() * 150);
          data['series'][1]['items'].push(randomValue);
        }
        
        data['series'].push({'name': "Critical", 'color': "#ed6647", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(Math.random() + Math.random() * 100);
          data['series'][2]['items'].push(randomValue);
        }
  
        for (g = 0; g < numGroups; g++) {
          time = new Date(start + g*interval).toISOString();
          data['groups'].push(time);
        }
  
        return data;
      }
      
      self.lineXAxis = ko.observable({viewportMin: new Date(2013,7,25), viewportMax: new Date(2013,8,6)});
      self.barXAxis = ko.observable({viewportMin: new Date(2013,7,25), viewportMax: new Date(2013,8,6)});
      self.overviewXAxis = ko.observable({viewportMin: new Date(2013,7,25), viewportMax: new Date(2013,8,6)});
      
      self.dataCursorPositionValue = ko.observable(null);
      
      var start = new Date(2013,6,1).getTime();
      var interval = 1000*60*60*24;
      var numGroups = 100;
      
      var lineData = generateRandomServerData(start, interval, numGroups, 1);
      self.lineSeriesValue = ko.observableArray(lineData["series"]);
      self.lineGroupsValue = ko.observableArray(lineData["groups"]);
      
      var barData = generateRandomCountData(start, interval, numGroups);
      self.barSeriesValue = ko.observableArray(barData["series"]);
      self.barGroupsValue = ko.observableArray(barData["groups"]);
      
      // For the bar chart, create a tooltip that displays information for all series at once
      var barTooltip = document.createElement('div');
      var tooltipLabelStyle = 'style="color:#737373; padding-top:0px; padding-bottom:0px; padding-left:2px; padding-right:2px; text-align:right;"';
      var tooltipValueStyle = 'style="color:#333333; padding-top:0px; padding-bottom:0px; padding-left:2px; padding-right:2px; text-align:left;"';
      
      self.tooltipCallback = function(dataContext) {
        var groupIndex = (dataContext.group - start) / interval;
        var numGood = barData['series'][0]['items'][groupIndex];
        var numWarning = barData['series'][1]['items'][groupIndex];
        var numCritical = barData['series'][2]['items'][groupIndex];
        
        barTooltip.innerHTML = '<span style="visibility: inherit;"><table style="border-collapse:separate; border-spacing:2px;"><tbody><tr>' +
          '<td ' + tooltipLabelStyle + '>Good</td>' +
          '<td ' + tooltipValueStyle + '>' + numGood + '</td>' +
          '</tr><tr>' +
          '<td ' + tooltipLabelStyle + '>Warning</td>' +
          '<td ' + tooltipValueStyle + '>' + numWarning + '</td>' +
          '</tr><tr>' +
          '<td ' + tooltipLabelStyle + '>Critical</td>' +
          '<td ' + tooltipValueStyle + '>' + numCritical + '</td>' +
          '</tr></tbody></table></span>';
                
        // Color the tooltip with the status with the highest count
        var maxCount = Math.max(numGood, numWarning, numCritical);
        dataContext.parentElement.style.borderColor = 
          (maxCount == numCritical) ? "#ed6647" : (maxCount == numWarning) ? "#fad55c" : "#68c182";
        return {'insert':barTooltip};
      };
      
      self.axisWidthValue = ko.observable('0'); 
      
      /**
       * Updates the X-axis of the correlated components.
       * It does not update the component that fires the event.
       * @param {object} event
       * @param {object} ui
       */
      self.updateXAxis = function(event) {
        if (event.target.id != 'overview')
          self.overviewXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
        if (event.target.id != 'lineChart')
          self.lineXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
        if (event.target.id != 'barChart')
          self.barXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
      };
  
      var busyContext = oj.Context.getPageContext().getBusyContext();
      busyContext.whenReady().then(function () {
        // Find the preferred width of the Y-axes
        // Align the two Y-axes by assigning them the same width
        var axisWidth = Math.max(
          document.getElementById('lineChart').getYAxis().getPreferredSize(750, 250).width, 
          document.getElementById('barChart').getYAxis().getPreferredSize(750, 150).width
        );
        self.axisWidthValue(axisWidth+'px');
        
        // The code above will trigger renders at the right size, update the overview chart after.
        var busyContext = oj.Context.getPageContext().getBusyContext();
        busyContext.whenReady().then(function () {
          // Align the overview to the chart plot areas
          var resizeOverviewChart = function () {
            oj.ComponentBinding.deliverChanges(); // force chart to rerender before we extract the bounds
            var chartBounds = document.getElementById('lineChart').getPlotArea().bounds;
            var chartBoundsYAxis = document.getElementById('lineChart').getYAxis().bounds;
            $('#overview').width(chartBounds.width + chartBoundsYAxis.width);
            $('#overview').css('margin-left', chartBoundsYAxis.width);
          };
        
          resizeOverviewChart();
          
          $(window).resize(function () {
            setTimeout(resizeOverviewChart, 300);
          });
        });
      });

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
    return new CustomerViewModel();
  }
);
