$(document).ready(function() {
    /*Datepicker*/
    $('.input-group .date').datepicker({
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyy-mm-dd'
    });
	
	/*Zingchart configuration*/
	
    zingchart.THEME = "classic";

    var myConfig = {
		"gui": {
		"contextMenu": {
		  "button": {
			"visible": false
		  },
        }},
		"graphset":[{
        "background-color": "white",
        "font-family": "Roboto",
        "type": "line",

        "legend": {
            "mediaRules": [{
                    "maxWidth": 600,
                    "layout": "x2",
                    "max-items": 2,
                },
                {
                    "minWidth": 601,
                    "layout": "x4",
                    "max-items": 4,
                }

            ],

            "margin": "auto auto -5 auto",
            "overflow": "page",
            "page-on": {
                "background-color": "black",
                "border-width": 1,
                "border-color": "black"
            },
            "page-off": {
                "background-color": "#eee",
                "border-width": 1,
                "border-color": "black"
            },
            "page-status": {
                "font-color": "black",
                "font-size": 11,
                "font-family": "Roboto",
            }

        },
        "crosshair-x": {
            "font-family": "Roboto",
            "line-style": "dashed",
            "plot-label": {
                "html-mode": true,
                "text": "%t: %v on %k",
                "decimals": 2,
                "font-size": 12,
                "multiple": true,
                "background-color": "#fd7e14",
                "color": "#fff",
                "border-width": 2,
                "border-color": "#e07653",
                "padding": "4 6",
                "shadow": false,
                "border-radius": 3
            },
            "scale-label": {
                "visible": false
            }
        },
        "scaleX": {
            "line-color": "#333",
            "font-family": "Roboto",
        },
        "scaleY": {
            "font-family": "Roboto",
            "line-color": "#333",
            "values": "0:100:10",
        },
        "tooltip": {
            "text": "%t: %v on %k",
            "visible": false
        },
        "plot": {
            "line-width": 3,
            "aspect": "spline",
            "font-family": "Roboto",
        },
        "plotarea": {
            "margin": "5% 15% 15% 7%",
            "font-family": "Roboto",
        },
        "series": []
		}]
    };

    /*Load data on page load*/
    loadProducts();
	
	/*Load data on click of submit*/
    $("#submit").on('click', function() {

        loadProducts();

    });
	
    /*Function to query the API and get the response*/
    function loadProducts() {
        var brands = "dove";
        var fromDt = $("#fromDt").val() || "2018-10-15";
        var toDt = $("#toDt").val() || "2018-10-24";
        var produrl = "http://analyticsapi-in.shortlyst.com/analytics-service/v1/insights/market/OSA/trend?brands=axe%2Cdove&type=EAN&fromDate=" + fromDt + "&toDate=" + toDt + "&mode=lite";
        var responseObj = null;
        var brands = null;
        $.ajax({
            url: produrl,
            dataType: "json",
            success: function(result) {
                if(result){
					responseObj = JSON.parse(JSON.stringify(result));
					renderZing(responseObj);
				}
            }
        });
    }

	/*Function to render the chart using response from API*/
    function renderZing(resp) {

        var seriesArr = [];		
        var brands = Object.keys(resp["result"]["overall"]["merchants"]);
		if(brands){
			var brandFirst = brands[0];
			var dates = Object.keys(resp["result"]["overall"]["merchants"][brandFirst]);
			var brand = null;
			var brandObj = null;
			for (var i in brands) {
				brand = brands[i];
				brandObj = resp["result"]["overall"]["merchants"][brand];
				seriesArr[i] = {};
				seriesArr[i]["values"] = Object.values(brandObj).map(Number);
				seriesArr[i]["text"] = brand;
			}
			myConfig["graphset"][0]["scaleX"]["values"] = dates;
			myConfig["graphset"][0]["series"] = seriesArr;
			zingchart.render({
				id: 'myChart',
				height: 600,
				data: myConfig
			});
		}
    }


});