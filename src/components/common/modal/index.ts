import { Platform, View } from "react-native";

export default Platform.OS !== 'web' ? require('react-native').Modal : require('./WebModal').default;



/*
///Example

<Modal
visible={true} //pass in condition or boolean
transparent>
<Text>skajjdhgfulwasjngvUSXHC;u</Text>
<div
    style={{
    height: "50px",
    width: "100px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "red"
    }}
    onClick={() => {
    console.log("div clicked")
    setVisible(false)
    }}>close dialog</div>
</Modal> */