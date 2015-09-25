/**
 * Txbb.Map 组件
 *
 * 0.3.1
 * by zhangyang
 */
(function(factory) {
    'use strict';

    if (typeof define !== 'undefined' && define.amd) {
        define('Txbb/Map', function() {
            return factory.call(null);
        });
    } else {
        if (!window.Txbb) window.Txbb = {};
        window.Txbb.Map = factory();
    }

}(function() {
    'use strict';

    // helps
    function q(s) {return document.querySelector(s);}
    function elem(nodeType, attrs) {
        var node = document.createElement(nodeType);
        if (attrs) {
            for (var k in attrs) {
                node[k] = attrs[k];
            }
        }
        return node;
    }
    var requestParameter = (function(){
        var search = location.search;
        var back = {};
        if (search) {
            search = search.substring(1);
            var groups = search.split('&');
            groups.forEach(function(item) {
                var group = item.split('=');
                back[group[0]] = decodeURIComponent(group[1]);
            });
        }

        return function(name) {
            return back[name];
        };
    }());
    Element.prototype.css = function (attrs) {
        if (!this) return this;
        if (attrs) {
            for (var k in attrs) {
                if (this.style.hasOwnProperty(k))
                    this.style[k] = attrs[k];
            }
        }
        return this;
    };
    Element.prototype.remove = function() {
        this.parentNode.removeChild(this);
    };
    Element.prototype.show = function() {
        this.style.display = 'block';
    };
    Element.prototype.hide = function() {
        this.style.display = 'none';
    };

    // styles
    var MapCtnStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px',
        'background-color' : '#ccc',
        'z-index': 10
    };
    var HeaderStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.innerWidth + 'px',
        height: '44px',
        'z-index': 11,
        'text-align': 'center',
        'font-size' : '18px',
        'line-height' : '44px',
        'box-shadow' : 'rgba(0, 0, 0, 0.2) 0px 4px 10px',
        'background-color' : '#77d2c5',
        color: '#fff'
    };
    var BackStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '44px',
        height: '44px',
        'z-index': 11,
        'text-align': 'center',
        'font-size' : '18px',
        'line-height' : '44px',
        'background-image' : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMUM3MDNDNEZBREExMUU0QUYzQUM5N0NGRUIwNzgyQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMUM3MDNDNUZBREExMUU0QUYzQUM5N0NGRUIwNzgyQyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxQzcwM0MyRkFEQTExRTRBRjNBQzk3Q0ZFQjA3ODJDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIxQzcwM0MzRkFEQTExRTRBRjNBQzk3Q0ZFQjA3ODJDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lDO+lQAAAdRJREFUeNrs2csrhFEYx/F3LCSJLJDG/RKxUVISMeQ+JWz8H/4Of4WNkkvJJbcpkhRLIuN+CxuXEJvxe/I7ZTmymXne56lv1h9n3jPnPROIxWKenybF89kY2MAGNrCBDWxgAxvYwAZOLHA2WkZ1fgBnoRXUica0gx22Hu2jEc1gwS6hBnSA2tGjVnAmWkCN6JDYB62bVgaaR03oiNh7rbt0Ole2GR2jDnSn9WvJYVtQlCt7o/V7WLBzqBWdEnut9eAh2Fkiz1EIXWk9aaWhaR4qLoi91Hq0TEUzqJsrGuIKqzxLO2wPn1XBnml9eRDsFOrjLizYE81vS+MojG65UUWT+fUwEMePacn2a1vALgD+CJ7kX/lIV/E/mMj9+yPtNq0wN622ZH6O41nhLzSMFlEQRVC5ZrBDD/IFv4DoUs1gmU805P1czhUSXaIZLPPBlV5FxUQXaQbLvKOBXysc4YqrBTu07NobqAyt89lWC3ZoOV9vogqig5rBMm+oH22hSrSG8jWDZV650ts8iclK52kGy7ygXrSDqonO1QyWeeZtyC6qITpHM9ih5b5rD9WiCe1gmSfUxcPJaDJeAPjufdjABjawgQ1sYAMb2MAGNrCBvW8BBgDhZGE5hz53jAAAAABJRU5ErkJggg==)',
        'background-size' : '30px',
        'background-repeat' : 'no-repeat',
        'background-position' : 'center center',
        'font-family' : 'SimSun,宋体',
        color: '#fff'
    };
    var OkStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '44px',
        height: '44px',
        'z-index': 11,
        'text-align': 'center',
        'font-size' : '12px',
        'line-height' : '44px',
        color: '#fff'
    };
    var FooterStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: window.innerWidth + 'px',
        height: '62px',
        margin: 0,
        'z-index': 11,
        'background-color' : 'rgba(0,0,0,.8)',
        'line-height' : '1.5',
        'box-sizing' : 'border-box',
        'padding' : '10px',
        'display' : 'none',
        'font-size' : '14px',
        'box-shadow' : 'rgba(0, 0, 0, 0.2) 0px 4px -10px',
        color: '#fff'
    };
    var AnchorStyle = {
        'background-image' : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAACgCAYAAACbg+u0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjU4OUY2OTAwNTQxMUU1ODQ0N0UwRTA5RjkwQkQ5OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjU4OUY2QTAwNTQxMUU1ODQ0N0UwRTA5RjkwQkQ5OSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGNTg5RjY3MDA1NDExRTU4NDQ3RTBFMDlGOTBCRDk5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGNTg5RjY4MDA1NDExRTU4NDQ3RTBFMDlGOTBCRDk5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fqM3LwAAEP5JREFUeNrsXXtw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)',
        'width' : '40px',
        'height' : '40px',
        'position' : 'absolute',
        'top' : '50%',
        'left' : '50%',
        'margin' : '-20px 0 0 -20px',
        'background-position' : '0 0',
        'background-size' : '40px',
        'z-index' : 11
    };
    var LocateStyle = {
        'background-image' : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAACgCAYAAACbg+u0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RjU4OUY2OTAwNTQxMUU1ODQ0N0UwRTA5RjkwQkQ5OSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RjU4OUY2QTAwNTQxMUU1ODQ0N0UwRTA5RjkwQkQ5OSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZGNTg5RjY3MDA1NDExRTU4NDQ3RTBFMDlGOTBCRDk5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjZGNTg5RjY4MDA1NDExRTU4NDQ3RTBFMDlGOTBCRDk5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fqM3LwAAEP5JREFUeNrsXXtw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)',
        'width' : '40px',
        'height' : '40px',
        'position' : 'absolute',
        'bottom' : '67px',
        'left' : '5px',
        'background-position' : '0 -40px',
        'background-size' : '40px',
        'z-index' : 11,
        'display' : 'none'
    };

    // 地图容器
    var _mapCtn;
    // 地图实例
    var _amap;
    // 地图中心点
    var _center;
    // JS Geo
    var geo = window.navigator.geolocation;

    // 初始化一个地图容器
    function _initMapCtn() {
        _mapCtn = q('.txbb-map');
        if (_mapCtn) _mapCtn.remove();
        var tmpl = '<header><span></span>位置详情<span>确定</span></header>';
            tmpl += '<div id="J-TxbbMap" class="body"></div>';
            tmpl += '<i></i>';
            tmpl += '<i></i>';
            tmpl += '<footer></footer>';
        if (!_mapCtn) {
            _mapCtn = elem('div', {className : 'txbb-map'});
            _mapCtn.css(MapCtnStyle);
            _mapCtn.innerHTML = tmpl;
            _mapCtn.children[0].children[0].css(BackStyle);
            _mapCtn.children[0].children[1].css(OkStyle);
            _mapCtn.children[0].css(HeaderStyle);
            _mapCtn.children[1].css(MapCtnStyle);
            _mapCtn.children[2].css(AnchorStyle);
            _mapCtn.children[3].css(LocateStyle);
            _mapCtn.children[4].css(FooterStyle);
            document.body.appendChild(_mapCtn);
        }
    }

    // 更新地址文字显示
    function _updateAddress(address) {
        if (!address) {
            _mapCtn.children[4].css({display : 'none'});
            return;
        } else {
            _mapCtn.children[4].css({display : 'block'}).innerHTML = address;
        }
    }

    // 获取当前屏幕中心点的位置信息
    // 并提供回调函数
    function _getCenterPosInfo(amap, callback) {
        var center = amap.getCenter();
        if (center.equals(_center)) return;
        AMap.service('AMap.PlaceSearch', function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize:1,
                pageIndex:1
            });
            _updateAddress('正在搜索...');
            if (_amap.getZoom() < 13) {
                _updateAddress('请放大地图进行选择！');
                return;
            }
            placeSearch.searchNearBy('', center, 300, function(status, result) {
                if (status === 'no_data' || !result.poiList.pois.length) {
                    _updateAddress('无法确定此位置，请放大地图进行详细定位');
                    return;
                }

                var poi = result.poiList.pois[0];
                var back = {
                    address : poi.address + ', ' + poi.name,
                    lng: center.lng,
                    lat: center.lat
                };
                _updateAddress(back.address);
                if (callback) callback(back);
            });
        });
        return center;
    }

    // 成功通过浏览器API获取到用户当前的位置
    function _successGotPositionByBrowser(poi, callback) {
        _getPoiByLngLat(poi, callback);
    }

    // 提供坐标，获取该坐标最靠近的位置信息
    function _getPoiByLngLat(point, success) {
        AMap.service('AMap.PlaceSearch', function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize:1,
                pageIndex:1
            });

            var poi = new AMap.LngLat(point.lng, point.lat);

            placeSearch.searchNearBy('', poi, 500, function(status, result) {
                if (status === 'no_data' || !result.poiList.pois.length) {
                    point.address = '无法确定你的具体位置';
                    success(point);
                    return;
                }
                var position = result.poiList.pois[0];
                point.address = position.address + ', ' + position.name + '附近';
                success(point);
            });
        });
    }

    var Map = function(){};

    Map.prototype = {

        // 高德地图key
        _amapKey: 0,

        /*===============
         配置第三方接口key
         ===============*/
        config: function(key, val) {
            if (key === 'AMapKey') this._amapKey = val;
        },

        /*===============
         选择位置、或者显示一个已有的位置
         options: (object)
           - confirm (function)
           - location (object)
           - readonly (boolean)
         ===============*/
        selectLocation: function(options) {
            _initMapCtn();

            var location = options.location;
            var readonly = options.readonly;
            var back = {};
            var initOpt = {zoom: 14, mapStyle: 'fresh', animateEnable: false};
            if (readonly === true) {
                initOpt.dragEnable = false;
                initOpt.keyboardEnable = false;
                initOpt.scrollWheel = false;
                _mapCtn.children[3].hide();
            } else {
                // _mapCtn.children[3].show();
            }

            _amap = new AMap.Map('J-TxbbMap', initOpt);

            if (location && location.lng && location.lat) {
                _center = new AMap.LngLat(location.lng, location.lat);
                back.lng = location.lng;
                back.lat = location.lat;
            } else if (location && location.cityName) {
                // _amap.setCity(location.cityName);
            }

            if (location && location.address) {
                _updateAddress(location.address);
                back.address = location.address;
            }

            if (_center) _amap.setCenter(_center);
            else _center = _amap.getCenter();

            if (readonly) {
                _amap.on('zoomchange', function() {
                    if (_center) _amap.setCenter(_center);
                });
                _mapCtn.children[0].children[0].onclick = function(){
                    window.history.back();
                    _mapCtn.remove();
                };
                _mapCtn.children[0].children[1].hide();
            } else {
                _amap.on('complete', function(){
                    _center = _getCenterPosInfo.call(null, _amap, function(poi){back = poi;});
                    _updateAddress(location && location.address ? location.address : '请拖动地图进行选择');
                });
                _amap.on('moveend', function(){
                    _center = _getCenterPosInfo.call(null, _amap, function(poi){back = poi;});
                });
                _amap.on('zoomend', function(){
                    if (_center) _amap.setCenter(_center);
                });
                _mapCtn.children[0].children[1].onclick = function(){
                    if (options.confirm) {
                        options.confirm(back);
                        _mapCtn.remove();
                    }
                };
            }

        },

        /*===============
         获得用户当前的位置
         options: (object)
           - success (function)
           - error (function)
         ===============*/
        getCurrentLocation: function(options) {
            var error = options.error ? options.error : function(){};
            if (geo) {
                geo.getCurrentPosition(function (pos) {
                    var lng = pos.coords.longitude;
                    var lat = pos.coords.latitude;
                    _successGotPositionByBrowser({
                        lng: lng,
                        lat: lat
                    }, options.success);
                }, function (err) {
                    if (err.code === 3) error('获取位置超时，请检查你的定位设置');
                    else error(err.message);
                }, {
                    timeout: 5000
                });
            } else error('你的手机太过时了！都不支持定位！');
        },

        /*===============
          根据浏览器参数显示指定位置
         ===============*/
        open: function() {
            var lng = requestParameter('lng');
            var lat = requestParameter('lat');
            var address = requestParameter('address');
            if (lng && lat && address) {
                map.selectLocation({
                    location: {
                        lng: lng,
                        lat: lat,
                        address: address
                    },
                    readonly: true
                });
            }
        }

    };

    var map = new Map();
    map.open();

    return map;
}));
