import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { appOperator } from '../../../../util/app.operator';
import { logger } from '../../../../util/logger';
import Alert from '../../../common/Alert';
import { NewRectButtonWithChildren } from '../../../common/buttons/RectButtonCustom';
import { navigationProp } from "../index";


interface LoginHeader_t {
    navigation: navigationProp
    setHeaderView?: React.Dispatch<React.SetStateAction<string>>,
    log?: logger
}
export const LoginHeader = ({ navigation, setHeaderView, log }: LoginHeader_t) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    return (
        <View style={styles.headerContainer}>
            <View /* Sec2: Form Container  */
                style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
                <Text /* Sec3: Form Heading  */
                    style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#555",
                        paddingHorizontal: 20,
                    }}
                >
                    Let's start with Login
                </Text>
                <Text /* Sec3: Form Description text  */
                    style={{
                        fontSize: 15,
                        color: "#555",
                        textAlign: "center",
                        paddingVertical: 20,
                        paddingHorizontal: 30,
                    }}
                >
                    Your HUElite Account is required to setup your devices with Alexa and
                    Google Assistant
                </Text>
                <TextInput /* Sec3: Email Input  */
                    style={{
                        minHeight: 50,
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

                <TextInput /* Sec3: Password Input  */
                    style={{
                        minHeight: 50,
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

                <NewRectButtonWithChildren /* Sec3: Login Button */
                    onPress={async () => {
                        log?.print("login button pressed")
                        appOperator.user({
                            cmd: "LOGIN",
                            email,
                            password,
                            onLoginFailed: ({ ERR }) => {
                                Alert.alert(ERR?.errCode ? ERR?.errCode : "UNKNOWN ERROR", ERR?.errMsg ? ERR.errMsg : "This could be due to technical error at backend, you can report the issue our forum. We regret for the inconveniences")
                            },
                            onLoginSuccess: () => {
                                log?.print("login successful>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                                navigation.replace("dashboard")
                            },
                            log: log ? new logger("user login operator", log) : undefined
                        })
                    }}
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
                    }}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}> Login</Text>
                </NewRectButtonWithChildren>
            </View>
            <NewRectButtonWithChildren /* Sec2: Signup Form switch button */
                style={{ marginTop: "5%" }}
                onPress={() => {
                    log?.print("Signup button pressed");
                    setHeaderView ? setHeaderView("SIGNUP") : {}
                }}
            >
                <Text style={{
                    textAlign: "center"
                }}> Dont have an account<Text style={{
                    color: "#5555ff",
                    fontWeight: "bold"
                }}>SignUP</Text></Text>
            </NewRectButtonWithChildren>
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