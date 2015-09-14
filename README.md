# Txbb.Map
同学帮帮地图组件

## Demo
选择：[http://txbb.github.io/txbb-map/test/selectLocation.html](http://txbb.github.io/txbb-map/test/selectLocation.html)

只读：[http://txbb.github.io/txbb-map/test/?lat=32.060125&lng=118.792073&address=江苏省南京市雨花台区软件大道丰盛商汇6栋314室南京云智信息科技有限公司](http://txbb.github.io/txbb-map/test/?lat=32.060125&lng=118.792073&address=%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%8D%97%E4%BA%AC%E5%B8%82%E9%9B%A8%E8%8A%B1%E5%8F%B0%E5%8C%BA%E8%BD%AF%E4%BB%B6%E5%A4%A7%E9%81%93%E4%B8%B0%E7%9B%9B%E5%95%86%E6%B1%876%E6%A0%8B314%E5%AE%A4%E5%8D%97%E4%BA%AC%E4%BA%91%E6%99%BA%E4%BF%A1%E6%81%AF%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8)

## 依赖的服务
[高德地图](http://lbs.amap.com/api/javascript-api/reference/summary/)

## 依赖的编程类库
没有

## 包含功能
1. 通过URL打开地址栏，显示位置
2. 选择一个位置然后获取位置信息
3. 获得用户当前的位置信息

## API

### 1. 通过URL地址栏访问之后显示地理位置
浏览器直接访问 `/?lng=113.345678&lat=38.98765&name=测试位置`

### 2. 在地图上选择地理位置获得选取的位置数据
```
Txbb.Map.selectLocation(options);
```
#### options
- confirm: 获取数据的回调函数，接收一个`object`类型参数，包含位置信息
- location: 默认显示的位置信息，可以包含经纬度数据(`location.lng`, `location.lat`)，城市名称(`location.city`)
- readonly: 代表地图是不是只读的

### 3. 获得当前的位置信息
```
Txbb.Map.getLocationInfo(options);
```
#### options
- success: 成功的回调函数，接收一个`object`类型参数`poi`，包含位置信息
- error: 失败的回调函数，接收一个`string`类型参数`msg`，代表错误信息

## Todo

### 配置地图服务的 KEY
Todo，按需加载服务
```javascript
Txbb.Map.config('AMapKey', '1234567890');
```
