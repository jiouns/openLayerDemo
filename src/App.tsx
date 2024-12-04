import TileLayer from 'ol/layer/Tile';
import './App.css';
import 'ol/ol.css'
import React, { useEffect, useRef, useState } from 'react';
import { Feature, Map } from 'ol';
import { OSM, XYZ } from 'ol/source';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import {  Point } from 'ol/geom';

const moveUp = (val: any) => {  
  // const view = val.getView();
  // let center = view.getCenter();
  val.view.animate({ // 动画
    center: [116.46, 39.92],
    zoom: 5,
    duration: 2000
  })
}

const App = () => {
  let map:any = null
  useEffect(() => {
   map = new Map({
    target:'map', // 指定 html 中的 id 属性
    layers: [ // 图层 可以多个
      new TileLayer({ // 瓦片图层 一般作用于地图底图
        // source: 自带的资源： OSM 和 bingMaps 还可以第三方
        // source: new OSM()
        source: new XYZ({ // x y 代表的是坐标 z 代表的是缩放级别 引用的是第三方 如下是高德地图
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
          // wrapX: false
        })
      }),
      new VectorLayer({ // 矢量图层 一般作用于地图上的点 线 面 等
        source: new VectorSource({
          // url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
          // url: 'https://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json',
          url: '/geoJson.json',
          format: new GeoJSON(),
        }),
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.4)'
          }),
          // 设置线的样式 描边
          stroke: new Stroke({
            color: 'rgba(0, 255, 0, 0.5)',
          })
        })
      })
    ],
    view: new View({
      center: [114.28, 30.59], // 中心点
      // center: fromLonLat([114.28, 30.59]), // 中心点 视图默认的投影坐标系 不是 经纬度坐标体系 是墨卡托坐标体系
      zoom: 5, // 缩放级别
      // minZoom: 3, // 缩放最小级别
      // maxZoom: 18, // 缩放最大级别
      // projection: 'EPSG:3857' //  默认值 投影仪坐标系 当没有设置projection 时 会使用默认的 投影坐标系 这时的 center 需要配套 fromLonLat 方法 进行转换
      projection: 'EPSG:4326', //  经纬度坐标体系 这时的 center 不需要转换直接 [114.28, 30.59]
      // extent: [114.28, 30.59, 115.28, 32.59] // 视图范围
    }),
  })
  // ----添加图标/图形在某个点上 start ------
  const anchorLayer = new VectorLayer({
    source: new VectorSource()
  });
  map.addLayer(anchorLayer);
  // const anchorFeature = new Feature({
  //   // 北京的经纬度 
  //   geometry: new Point([116.46, 39.92]),
  // });
  // anchorFeature.setStyle(
  //   new Style({
  //     // 图标
  //     // image: new Icon({
  //     //   src: '/hello.jpeg',
  //     //   width: 20,
  //     //   height: 20,
  //     // })
  //     // 圆形
  //     image: new CircleStyle({
  //       radius: 10,
  //       fill: new Fill({
  //         color: 'rgba(255, 255, 255, 0.5)'
  //       }),
  //       stroke: new Stroke({
  //         color: 'rgba(0, 255, 0, 0.5)',
  //       })
  //     })
  //   })
  // );
  // anchorLayer.getSource()?.addFeature(anchorFeature);
  // map.addLayer(anchorLayer);
  // ------- end  ---------- 

  // 点击地图 绘制一个图标
  map.on('click', (e:any) => {
    const feature = new Feature({
      geometry: new Point(e.coordinate),
    })
    feature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.5)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 255, 0, 0.5)',
          })
        })
      })
    )
    anchorLayer.getSource()?.addFeature(feature);
  })
},[map])

// 在武汉的地方绘制一个图标

  return (
    <div style={{width:'100%',height:'800px'}}>
      openLayer：
      <div onClick={() => moveUp(map)}>上移</div>
      <div id="map"></div>
    </div>
  );
};

export default App;
