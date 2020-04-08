<template>
  <div class="container home">
    <div id="mapboxViews" :style="{'width': '100%','height':'100%'}"></div>
  </div>
</template>

<script>
// @ is an alias to /src

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import style from "@/assets/mapbox/style.json";

import points from "@/assets/mapbox/point.json";
import lineStrings from "@/assets/mapbox/lineString.json";
import polygins from "@/assets/mapbox/polygin.json";

export default {
  name: "Home",
  data() {
    return {
      config: {
        style: style,
        center: [108.8776874542, 34.191854711],
        zoom: 9
      },
      map: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.map = new mapboxgl.Map({
        container: "mapboxViews",
        ...this.config
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on("load", () => {
        this.load();
      });
    },
    load() {
      //添加点数据
      this.addPonits();
      //添加面
      // this.addPolygin();
      //添加线
      // this.addLineStrings();
    },
    addPonits() {
      this.map.addSource("points", {
        type: "geojson",
        data: points
      });
      this.map.addLayer({
        id: "points-layers",
        type: "circle",
        source: "points",
        paint: {
          "circle-color": [
            'step', ['get', 'radius'],
              '#fff',
              3, 'red',
              5, 'yellow',
              7, 'blue',
          ],
          // "circle-radius": [
          //   "interpolate",
          //   ["linear"],
          //   ["zoom"],
          //   0,
          //   ['get','radius'],
          //   10,
          //   ['*', ["to-number", ["get", "id"]], 10]
          // ]
          // "circle-radius": {
          //     "stops": [
          //         [1, 2],
          //         [10, 20]
          //     ]
          // }
        },
        filter: ['in','radius',5]
      });
      this.map.addLayer({
        id: "points-layers-text",
        type: "symbol",
        source: "points",
        paint: {
          "text-color": "yellow",
        },
        layout:{
          // "text-field": ["geometry-type"]
          // "text-field": ["coalesce", 'aaa' ,'bbb']
          "text-field": ['get' ,'name']
          // "text-field": ['concat' ,'name', 'aaa']

        },
        filter:["has", 'id']
      });
    },
    addLineStrings() {
      this.map.addSource("linestrings", {
        type: "geojson",
        data: lineStrings
      });
      this.map.addLayer({
        id: "linestrings-layers",
        type: "line",
        source: "linestrings",
        paint: {
          "line-color": "#fff",
          "line-width": 5
        }
      });
    },
    addPolygin() {
      this.map.addSource("polygins", {
        type: "geojson",
        data: polygins
      });
      this.map.addLayer({
        id: "polygins-layers",
        type: "fill",
        source: "polygins",
        paint: {
          "fill-color": "green"
        }
      });
    }
  }
};
</script>
