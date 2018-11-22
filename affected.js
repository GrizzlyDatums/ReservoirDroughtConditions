require([
      "esri/views/2d/draw/Draw",
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/geometry/Polygon",
      "esri/geometry/geometryEngine"
    ], function(
      Draw,
      Map, MapView,
      Graphic,
      Polygon,
      geometryEngine
    ) {

      var map = new Map({
        basemap: "streets"
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-99.018, 31.9686],
        zoom: 6
      });

      // add the button for drawing polygons underneath zoom buttons
      view.ui.add("draw-polygon", "bottom-left");

      var draw = new Draw({
        view: view
      });

      // draw polygon button
      document.getElementById("draw-polygon").addEventListener("click",
        function() {
          view.graphics.removeAll();
          // create() will return a reference to an instance of PolygonDrawAction
          var action = draw.create("polygon");

          // focus the view to activate keyboard shortcuts for drawing polygons
          view.focus();

          // listen polygonDrawAction events to give immediate visual feedback
          // to users as the polygon is being drawn on the view.
          action.on("vertex-add", drawPolygon);
          action.on("cursor-update", drawPolygon);
          action.on("vertex-remove", drawPolygon);
          action.on("redo", drawPolygon);
          action.on("undo", drawPolygon);
          action.on("draw-complete", drawPolygon);
        });

      // this function is called from the polygon draw action events
      // to provide a visual feedback to users as they are drawing a polygon
      function drawPolygon(event) {
        var vertices = event.vertices;

        //remove existing graphic
        view.graphics.removeAll();

        // create a new polygon
        var polygon = new Polygon({
          rings: vertices,
          spatialReference: view.spatialReference
        });

        // create a new graphic representing the polygon, add it to the view
        var graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: "simple-fill", // autocasts as SimpleFillSymbol
            color: [178, 102, 234, 0.8],
            style: "solid",
            outline: { // autocasts as SimpleLineSymbol
              color: [255, 255, 255],
              width: 2
            }
          }
        });

        view.graphics.add(graphic);

        // calculate the area of the polygon
        var area = geometryEngine.geodesicArea(polygon, "acres");
        if (area < 0) {
          // simplify the polygon if needed and calculate the area again
          var simplifiedPolygon = geometryEngine.simplify(polygon);
          if (simplifiedPolygon) {
            area = geometryEngine.geodesicArea(simplifiedPolygon, "acres");
          }
        }
        // start displaying the area of the polygon
        labelAreas(polygon, area);
      }

      //Label polyon with its area
      function labelAreas(geom, area) {
        var graphic = new Graphic({
          geometry: geom.centroid,
          symbol: {
            type: "text",
            color: "black",
            haloColor: "black",
            haloSize: "1px",
            text: area.toFixed(2) + " acres",
            xoffset: 3,
            yoffset: 3,
            font: { // autocast as Font
              size: 14,
              family: "sans-serif"
            }
          }
        });
        view.graphics.add(graphic);
      }
    });