import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { _appState } from '../../../../redux/rootReducer';
import { appOperator } from '../../../../util/app.operator';
import { logger } from '../../../../util/logger';
import { navigationProp } from "../index"

/**
 * 
 * //TODO email validation before signing up
 * //TODO retype pass must match before procceding
 */
interface SignUpHeader_t {
    navigation: navigationProp
    setHeaderView?: React.Dispatch<React.SetStateAction<string>>
    log?: logger
}
export const SignUpHeader = ({ navigation, setHeaderView, log }: SignUpHeader_t) => {
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");

    return (
        <View style={styles.headerContainer}>
            <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#555",
                        paddingHorizontal: 20,
                    }}
                >
                    Welcome to HUElite Community
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        color: "#555",
                        textAlign: "center",
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                    }}
                >
                    Your HUElite Account will be used to link and setup your devices with Alexa and
                    Google Assistant
        </Text>
                <TextInput
                    style={{
                        height: 50,
                        width: "80%",
                        maxWidth: 400,
                        borderColor: "#5555ff7f",
                        color: "#5555ff",
                        borderWidth: 1,
                        borderRadius: 25,
                        textAlign: "center",
                        alignSelf: "center",
                        marginTop: "10%",
                    }}

                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    placeholder="email/userID"
                    value={email}
                    autoCompleteType="email"
                />

                <TextInput
                    style={{
                        height: 50,
                        width: "80%",
                        maxWidth: 400,
                        borderColor: "#5555ff7f",
                        color: "#5555ff",
                        borderWidth: 1,
                        borderRadius: 25,
                        textAlign: "center",
                        alignSelf: "center",
                        marginTop: "10%",
                    }}

                    onChangeText={(text) => {
                        setUserName(text);
                    }}
                    placeholder="Username"
                    value={userName}
                //autoCompleteType="username"
                />

                <TextInput
                    style={{
                        height: 50,
                        width: "80%",
                        maxWidth: 400,
                        borderColor: "#5555ff7f",
                        color: "#5555ff",
                        borderWidth: 1,
                        borderRadius: 25,
                        textAlign: "center",
                        alignSelf: "center",
                        marginTop: "10%",
                    }}
                    onChangeText={(text) => {
                        setPassword(text);
                    }}
                    placeholder="password"
                    value={password}
                    secureTextEntry={true}
                />
                <TextInput
                    style={{
                        height: 50,
                        width: "80%",
                        maxWidth: 400,
                        borderColor: "#5555ff7f",
                        color: "#5555ff",
                        borderWidth: 1,
                        borderRadius: 25,
                        textAlign: "center",
                        alignSelf: "center",
                        marginTop: "10%",
                    }}
                    onChangeText={(text) => {
                        setRePassword(text);
                    }}
                    placeholder="re-type password"
                    value={re_password}
                    secureTextEntry={true}
                />

                <RectButton /* Sec3: SignUp button */
                    style={{
                        backgroundColor: "#5555ff",
                        height: 50,
                        width: "80%",
                        maxWidth: 400,
                        borderRadius: 25,
                        alignSelf: "center",
                        marginTop: "10%",
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 5,
                    }}
                    onPress={() => {
                        appOperator.user({
                            cmd: "SIGNUP",
                            userName,
                            password,
                            re_password,
                            email,
                            onSignupFailed: ({ ERR }) => {
                                Alert.alert(ERR?.errCode ? ERR?.errCode : "UNKNOWN ERROR", ERR?.errMsg ? ERR.errMsg : "This could be due to technical error at backend, you can report the issue our forum. We regret for the inconveniences")
                            },
                            onSignupSuccess: () => {
                                navigation.replace("dashboard")
                            },
                            log: log ? new logger("user signup operator", log) : undefined
                        })
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                        Signup
                 </Text>
                </RectButton>
            </View>
            <RectButton
                style={{ marginTop: "5%" }}
                onPress={() => {
                    console.log("Signup");
                    setHeaderView ? setHeaderView("LOGIN") : {}
                }}
            >
                <Text style={{ textAlign: "center" }}>
                    Already have an account
                    <Text style={{ color: "#5555ff", fontWeight: "bold" }}>Login</Text>
                </Text>
            </RectButton>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        marginVertical: "2%"
    },
});


//TODO adjust headers for smaller screen sizes