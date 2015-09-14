# Txbb.Map
同学帮帮地图组件

## 依赖的服务
[高德地图](http://lbs.amap.com/api/javascript-api/reference/summary/)

## 依赖的编程类库
没有

## 包含功能
1. 通过URL打开地址栏，显示位置
2. 选择一个位置然后获取选取的位置信息
3. 获得当前的位置

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
