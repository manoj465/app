"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
var expo_linear_gradient_1 = require("expo-linear-gradient");
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_redash_1 = require("react-native-redash");
var app_operator_1 = require("../../util/app.operator");
var DateTimeUtil_1 = require("../../util/DateTimeUtil");
var sliderHeight = 35;
var sliderHeightExtension = 4;
var BrightnessSlider_test_ = /** @class */ (function (_super) {
    __extends(BrightnessSlider_test_, _super);
    function BrightnessSlider_test_(props) {
        var _this = _super.call(this, props) || this;
        _this.pinState = new react_native_reanimated_1["default"].Value(react_native_gesture_handler_1.State.UNDETERMINED);
        _this.timeStamp = Date.now();
        _this.offset = new react_native_reanimated_1["default"].Value(0);
        //@ts-ignore
        //BR = round(multiply(divide(this.offsetX, (this.state.sliderWidth - sliderHeight)), 100))
        _this.componentDidMount = function () {
            _this.offsetX = react_native_redash_1.clamp(_this.offset, 0, _this.state.sliderWidth - sliderHeight);
        };
        _this.onPanGestureEvent = react_native_reanimated_1["default"].event([{ nativeEvent: { translationX: _this.offset, state: _this.pinState } }], {
            useNativeDriver: true
        });
        _this.updateColor = function (v, gestureState, log) {
            if (v < 5)
                v = 0;
            app_operator_1.appOperator.device({
                cmd: "COLOR_UPDATE",
                deviceMac: ["jhv"],
                hsv: { v: v },
                gestureState: gestureState,
                log: log
            });
        };
        _this.state = {
            sliderWidth: 100,
            count: 0
        };
        return _this;
    }
    BrightnessSlider_test_.prototype.render = function () {
        var _this = this;
        return (react_1["default"].createElement(react_native_1.View, { style: { overflow: "visible" } },
            react_1["default"].createElement(react_native_1.View, { style: {
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "flex-end",
                    marginBottom: 6
                } },
                react_1["default"].createElement(react_native_redash_1.ReText, { style: {
                        color: "#fff",
                        fontSize: 25,
                        fontWeight: "bold"
                    }, text: react_native_reanimated_1.concat(this.state.sliderWidth) }),
                react_1["default"].createElement(react_native_1.Text, { style: {
                        color: "#fff",
                        fontSize: 25,
                        fontWeight: "bold"
                    } }, "%")),
            react_1["default"].createElement(expo_linear_gradient_1.LinearGradient, { onLayout: function (event) {
                    var width = event.nativeEvent.layout.width;
                    _this.setState({
                        sliderWidth: width
                    });
                }, style: {
                    justifyContent: "center",
                    opacity: 1,
                    height: sliderHeight,
                    width: "100%",
                    borderRadius: 15
                }, start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, 
                //colors={[bgColor[0], bgColor[1]]}
                colors: ["#ffffff", "#ff00ff"] },
                react_1["default"].createElement(react_native_gesture_handler_1.PanGestureHandler, { onGestureEvent: this.onPanGestureEvent, onHandlerStateChange: this.onPanGestureEvent },
                    react_1["default"].createElement(react_native_reanimated_1["default"].View, { style: [
                            {
                                position: "absolute",
                                height: sliderHeight + sliderHeightExtension,
                                width: sliderHeight + sliderHeightExtension,
                                borderRadius: 25,
                                backgroundColor: "#ddd",
                                top: -sliderHeightExtension / 2,
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            {
                                transform: [{ translateX: this.offsetX }]
                            },
                        ] },
                        react_1["default"].createElement(react_native_1.View, { style: {
                                height: "80%",
                                width: "80%",
                                borderRadius: 50,
                                backgroundColor: "red",
                                borderWidth: 10,
                                borderColor: "#fff",
                                alignItems: "center",
                                justifyContent: "center"
                            } }))))));
    };
    return BrightnessSlider_test_;
}(react_1.Component));
exports["default"] = BrightnessSlider_test_;
var _a = react_native_1.Dimensions.get("window"), width = _a.width, height = _a.height;
var brSlider = function (_a) {
    var _b = _a.initBrValue, initBrValue = _b === void 0 ? 0 : _b, _c = _a.bgColor, bgColor = _c === void 0 ? ["#ffffff00", "#ffffff77"] : _c, deviceMac = _a.deviceMac, _d = _a.color, color = _d === void 0 ? "#ffffff" : _d, log = _a.log;
    //console.log("initBr : " + initBrValue);
    var pinState = react_native_redash_1.useValue(react_native_gesture_handler_1.State.UNDETERMINED);
    var _e = react_1.useState(0), sliderWidth = _e[0], setSliderWidth = _e[1];
    var offset = react_native_redash_1.useValue((initBrValue / 100) * (width * 0.9));
    var offsetX = react_native_redash_1.clamp(offset, 0, sliderWidth - sliderHeight);
    //@ts-ignore
    var BR = react_native_redash_1.round(react_native_reanimated_1.multiply(react_native_reanimated_1.divide(offsetX, (sliderWidth - sliderHeight)), 100));
    var timeStamp = Date.now();
    var gestureHandler = react_native_reanimated_1.event([
        {
            //@ts-ignore
            nativeEvent: function (_a) {
                var x = _a.x, temp1state = _a.state;
                return react_native_reanimated_1.block([
                    react_native_reanimated_1.set(pinState, temp1state),
                    react_native_reanimated_1.cond(react_native_reanimated_1.eq(temp1state, react_native_gesture_handler_1.State.ACTIVE), react_native_reanimated_1.set(offset, react_native_reanimated_1.add(offset, x))),
                ]);
            }
        },
    ], { useNativeDriver: true });
    var updateColor = function (v, gestureState, log) {
        if (v < 5)
            v = 0;
        app_operator_1.appOperator.device({
            cmd: "COLOR_UPDATE",
            deviceMac: deviceMac,
            hsv: { v: v },
            gestureState: gestureState,
            log: log
        });
    };
    react_native_reanimated_1.useCode(function () { return [
        react_native_reanimated_1.call([BR, pinState], function (_a) {
            var BR = _a[0], pinState = _a[1];
            if (DateTimeUtil_1.getTimeDiffNowInMs(timeStamp) > 200 && pinState == react_native_gesture_handler_1.State.ACTIVE) {
                console.log("<<<< Sending Bightness- >>>>");
                timeStamp = Date.now();
                updateColor(BR, pinState, log);
            }
            else {
                //console.log("<<<< cannot send Bightness- >>>>")
            }
            /* if (pinState == State.ACTIVE) {
              if (getTimeDiffNowInMs(timeStamp) > 200) {
                timeStamp = getCurrentTimeStamp();
                updateColor(Math.min(100, Math.round(BR)), pinState, log)
              }
            } else if (pinState == State.END) {
              console.log("<<<< --Sending Bightness- >>>>")
              setTimeout(() => {
                timeStamp = getCurrentTimeStamp();
                updateColor(Math.min(100, Math.round(BR)), pinState, log)
              }, 200);
            } */
        }),
    ]; }, [BR, pinState]);
    return (react_1["default"].createElement(react_native_1.View, { style: { overflow: "visible" } },
        react_1["default"].createElement(react_native_1.View, { style: {
                display: "flex",
                flexDirection: "row",
                alignSelf: "flex-end",
                marginBottom: 6
            } },
            react_1["default"].createElement(react_native_redash_1.ReText, { style: {
                    color: "#fff",
                    fontSize: 25,
                    fontWeight: "bold"
                }, text: react_native_reanimated_1.concat(BR) }),
            react_1["default"].createElement(react_native_1.Text, { style: {
                    color: "#fff",
                    fontSize: 25,
                    fontWeight: "bold"
                } }, "%")),
        react_1["default"].createElement(expo_linear_gradient_1.LinearGradient, { onLayout: function (event) {
                var width = event.nativeEvent.layout.width;
                setSliderWidth(width);
            }, style: {
                justifyContent: "center",
                opacity: 1,
                height: sliderHeight,
                width: "100%",
                borderRadius: 15
            }, start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, colors: [bgColor[0], bgColor[1]] },
            react_1["default"].createElement(react_native_gesture_handler_1.PanGestureHandler, { onGestureEvent: gestureHandler, onHandlerStateChange: gestureHandler },
                react_1["default"].createElement(react_native_reanimated_1["default"].View, { style: [
                        {
                            position: "absolute",
                            height: sliderHeight + sliderHeightExtension,
                            width: sliderHeight + sliderHeightExtension,
                            borderRadius: 25,
                            backgroundColor: "#ddd",
                            top: -sliderHeightExtension / 2,
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        {
                            transform: [{ translateX: offsetX }]
                        },
                    ] },
                    react_1["default"].createElement(react_native_1.View, { style: {
                            height: "80%",
                            width: "80%",
                            borderRadius: 50,
                            backgroundColor: color,
                            borderWidth: 10,
                            borderColor: "#fff",
                            alignItems: "center",
                            justifyContent: "center"
                        } }))))));
};
