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
  
    function ViewModel() {
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
  
        return data;
      }

      var generateRandomCountData = function(start, interval, numGroups) {
        var data = {'groups': [], 'series': []};
        var time, s, g;
        
        data['series'].push({'name': "d500018b", 'color': "#68c182", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(10 + Math.random() * 35);
          data['series'][0]['items'].push(randomValue);
        }
        
        data['series'].push({'name': "d5000180", 'color': "#fad55c", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(10 + Math.random() * 35);
          data['series'][1]['items'].push(randomValue);
        }
        
        data['series'].push({'name': "d5000181", 'color': "#ed6647", 'items': []});
        for (var g = 0; g < numGroups; g++) {
          var randomValue = Math.round(10 + Math.random() * 35);
          data['series'][2]['items'].push(randomValue);
        }
  
        for (g = 0; g < numGroups; g++) {
          time = new Date(start + g*interval).toISOString();
          data['groups'].push(time);
        }
  
        console.log(data)
        return data;
      }

      var start = new Date(2018, 2, 1).getTime();
      var interval = 1000 * 60 * 60 * 24;
      var numGroups = 87;
      var mockingData = generateRandomCountData(start, interval, numGroups);
      self.powerConsumptionSeriesValue = ko.observableArray(mockingData['series']);
      // self.powerConsumptionGroupsValue = ko.observableArray(mockingData['groups']);
      self.powerConsumptionGroupsValue = ko.observableArray()
      
      self.temperatureXAxis = ko.observable({viewportMin: new Date(2018, 2, 1), viewportMax: new Date(2018, 4, 28)});
      self.powerConsumptionXAxis = ko.observable({viewportMin: new Date(2018, 2, 1), viewportMax: new Date(2018, 4, 28)});
      self.pressureXAxis = ko.observable({viewportMin: new Date(2018, 2, 1), viewportMax: new Date(2018, 4, 28)});
      
      self.dataCursorPositionValue = ko.observable(null);

      self.temperatureSeriesValue = ko.observableArray();
      self.temperatureGroupsValue = ko.observableArray();
      $.getJSON('js/data/temperature_data.json', function(data) {

        var series = []
        for (var i = 0; i < data['series'].length; i++) {
          var items = []
          for (var j = 0; j < data['series'][i]['items'].length; j++) {
            items.push(data['series'][i]['items'][j]['avg'])
          }
          series.push({
            name: data['series'][i]['name'],
            items: items
          })
        }
        self.temperatureSeriesValue(series)

        var groups = []
        for (var i = 0; i < data['groups'].length; i++) {
          groups.push(new Date(data['groups'][i]))
        }
        self.temperatureGroupsValue(groups)
        self.powerConsumptionGroupsValue(groups)
      })

      self.pressureSeriesValue = ko.observableArray();
      self.pressureGroupsValue = ko.observableArray();
      $.getJSON('js/data/pressure_data.json', function(data) {

        var series = []
        for (var i = 0; i < data['series'].length; i++) {
          var items = []
          for (var j = 0; j < data['series'][i]['items'].length; j++) {
            items.push(data['series'][i]['items'][j]['avg'])
          }
          series.push({
            name: data['series'][i]['name'],
            items: items
          })
        }
        self.pressureSeriesValue(series)

        var groups = []
        for (var i = 0; i < data['groups'].length; i++) {
          groups.push(new Date(data['groups'][i]))
        }
        self.pressureGroupsValue(groups)
      })
      
      // For the bar chart, create a tooltip that displays information for all series at once
      var barTooltip = document.createElement('div');
      var tooltipLabelStyle = 'style="color:#737373; padding-top:0px; padding-bottom:0px; padding-left:2px; padding-right:2px; text-align:right;"';
      var tooltipValueStyle = 'style="color:#333333; padding-top:0px; padding-bottom:0px; padding-left:2px; padding-right:2px; text-align:left;"';
      
      self.tooltipCallback = function(dataContext) {
        var groupIndex = (dataContext.group - start) / interval;
        var numGood = mockingData['series'][0]['items'][groupIndex];
        var numWarning = mockingData['series'][1]['items'][groupIndex];
        var numCritical = mockingData['series'][2]['items'][groupIndex];
        
        barTooltip.innerHTML = '<span style="visibility: inherit;"><table style="border-collapse:separate; border-spacing:2px;"><tbody><tr>' +
          '<td ' + tooltipLabelStyle + '>d500018b</td>' +
          '<td ' + tooltipValueStyle + '>' + numGood + '</td>' +
          '</tr><tr>' +
          '<td ' + tooltipLabelStyle + '>d5000180</td>' +
          '<td ' + tooltipValueStyle + '>' + numWarning + '</td>' +
          '</tr><tr>' +
          '<td ' + tooltipLabelStyle + '>d5000181</td>' +
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
        if (event.target.id != 'pressureChart')
          self.pressureXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
        if (event.target.id != 'temperatureChart')
          self.temperatureXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
        if (event.target.id != 'powerConsumptionChart')
          self.powerConsumptionXAxis({viewportMin: event.detail['xMin'], viewportMax: event.detail['xMax']});
      };
  
      var busyContext = oj.Context.getPageContext().getBusyContext();
      busyContext.whenReady().then(function () {
        // Find the preferred width of the Y-axes
        // Align the two Y-axes by assigning them the same width
        var axisWidth = Math.max(
          document.getElementById('temperatureChart').getYAxis().getPreferredSize(750, 250).width, 
          document.getElementById('powerConsumptionChart').getYAxis().getPreferredSize(750, 150).width,
          document.getElementById('pressureChart').getYAxis().getPreferredSize(750, 100).width
        );
        self.axisWidthValue(axisWidth+'px');
      });
    }

    return new ViewModel();
  }
);
