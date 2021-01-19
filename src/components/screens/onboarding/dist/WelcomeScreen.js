"use strict";
exports.__esModule = true;
exports.WelcomeScreen = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var RectButtonCustom_1 = require("../../common/buttons/RectButtonCustom");
var styles_1 = require("../../common/styles");
exports.WelcomeScreen = function (_a) {
    var navigation = _a.navigation;
    return (react_1["default"].createElement(react_native_1.View, { style: {
            backgroundColor: styles_1["default"].themeColors.primary,
            flex: 1,
            display: "flex"
        } },
        react_1["default"].createElement(Header, null),
        react_1["default"].createElement(Footer, null)));
};
var Header = function () {
    return (react_1["default"].createElement(react_native_1.View, { style: {
            backgroundColor: "white",
            flex: 0.75,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            justifyContent: "center",
            alignItems: "center"
        } },
        react_1["default"].createElement(react_native_1.View, { style: {
                display: "flex",
                flexDirection: "row"
            } },
            react_1["default"].createElement(react_native_1.View, { style: {
                    paddingHorizontal: 20,
                    flex: 1,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                } },
                react_1["default"].createElement(react_native_1.Image, { source: require("../../../../assets/images/onboarding/OB_1.png"), style: {
                        height: 400,
                        width: "50%"
                    } }),
                react_1["default"].createElement(react_native_1.Text, { style: [
                        styles_1["default"].H1,
                        { textAlign: "center" }
                    ] }, "heading text"),
                react_1["default"].createElement(react_native_1.Text, { style: [styles_1["default"].H7, { textAlign: "center" }] }, "kshdablfi sdjkahf; s;djhf s.jkdfh;ouw jsdh;m asdjhfu sd;jofvha;s fo;sudfj ojsd  asdfgv ojb  kj;")))));
};
var Footer = function () {
    return (react_1["default"].createElement(react_native_1.View, { style: {
            backgroundColor: styles_1["default"].themeColors.primary,
            flex: 0.25
        } },
        react_1["default"].createElement(RectButtonCustom_1.NewRectButton, { useReanimated: false, text: "Next", buttonStyle: {
                width: "80%",
                alignSelf: "center"
            }, onPress: function () {
                console.log("test console log");
            } })));
};
