import React, { FC, useEffect } from'react'
import { Map } from'ol'
import TileLayer from'ol/layer/Tile'
import VectorLayer from'ol/layer/Vector'
import VectorSource from'ol/source/Vector'
import GeoJSON from'ol/format/GeoJSON'
import Style from'ol/style/Style'
import Fill from'ol/style/Fill'
import Stroke from'ol/style/Stroke'
import XYZ from'ol/source/XYZ'
import View from'ol/View'
import './index.module.css'

interface MapProps {
    viewObject?: {
        center?:[],
        projection?:string,
        zoom?: number,
    },
    tileLayer?: {},
    vectorLayer?: {},
}
// center 中心点 默认是 武汉
const MapComponent: FC<MapProps> = ({viewObject = {center: [114.28, 30.59],projection:'EPSG:4326',zoom: 10},tileLayer,vectorLayer}) => {
    let map: any = null
    // 初始化地图
    useEffect(() => {
        map = new Map({
            target:'map',
            layers: [ // 图层 可以多个
                new TileLayer(tileLayer ||{ // 瓦片图层 一般作用于地图底图
                // source: 自带的资源： OSM 和 bingMaps 还可以第三方
                // source: new OSM()
                    source: new XYZ({ // x y 代表的是坐标 z 代表的是缩放级别 引用的是第三方 如下是高德地图
                        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
                        wrapX: false
                    })
                }),
                new VectorLayer(vectorLayer|| { // 矢量图层 一般作用于地图上的点 线 面 等
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
            view: new View(
                viewObject
            ),
        })
    })
    return (
        <div id="map"></div>
    )
}
export default MapComponent