import TileLayer from 'ol/layer/Tile';
import './App.css';
import 'ol/ol.css'
import React, { useEffect, useRef, useState } from 'react';
import { Feature, Map, Overlay } from 'ol';
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
import { defaults } from 'ol/interaction';
import Icon from 'ol/style/Icon';
import {  LineString, Point, Polygon } from 'ol/geom';
import MapComponent from './Map';
import InitMap from './components/initMap';

const App = () => {
  let map:any = null
  // 挂载
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
  // interAction 拖放 /交互
    interactions:defaults({
      doubleClickZoom: false, // 是否双击放大
    })
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

  // 点击地图 绘制一个圆圈
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

  // 绘制一条线
  // const lineLayer = new VectorLayer({
  //   source: new VectorSource()
  // })
  // map.addLayer(lineLayer);

  // const feature = new Feature({
  //   geometry: new LineString([[116.46, 39.92],[121.47, 31.22]]),
  // })

  // feature.setStyle(
  //   new Style({
  //     stroke: new Stroke({
  //       color: 'green',
  //       width: 5,
  //     })
  //   })
  // )
  // lineLayer.getSource()?.addFeature(feature);

  const polygonLayer = new VectorLayer({
    source: new VectorSource()
  })
  map.addLayer(polygonLayer);

  // 绘制一个无规则图形 三维数组 坐标要顺时针或者逆时针排序 否则会出现图形不闭合的情况
  const polygonFeature = new Feature({
    // 合肥 北京 沈阳 上海
    // geometry: new Polygon([[[117.17,31.52],[116.46, 39.92],[123.4, 41.8],[121.47, 31.22]]]),
    geometry: new Polygon([[[121.47, 31.22],[123.4, 41.8],[116.46, 39.92],[117.17,31.52]]]),
  })
  polygonFeature.setStyle(
    new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.5)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 255, 0, 0.5)',
      })
    })
  )
  polygonLayer.getSource()?.addFeature(polygonFeature);  

  // 通过dom将图片 放到地图上
  const overlay = new Overlay({
    element: document.querySelector('.overlay>img') as HTMLElement,
    // 没有使用 offset 的情况下， 默认是以图片左上角的点作为锚点
    offset: [-50, -50],
  });
  overlay.setPosition([114.28, 30.59])
  map.addOverlay(overlay)
  // ------- end  ----------
},[map])

  return (
    <div style={{width:'100%',height:'800px'}}>
      openLayer：
      {/* 以武汉为中心点的初始地图 */}
      {/* <InitMap /> */}
      {/* <MapComponent /> */}
      <div id='map'></div>
      <div className="overlay">
        <img src="/hello.jpeg" alt="" width={'50px'} height={'50px'} />
      </div>
    </div>
  );
};

export default App;
