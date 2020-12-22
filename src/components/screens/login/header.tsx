import React, { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { GetStartedNavigationProp } from '.';
import { _appState } from '../../../redux/reducers';
import { myAxios } from '../../../services/gql_n_rest/axios';
import { logFun_t } from '../../../util/logger';
import { login, signUp } from './loginHelper';


interface LoginHeader_t { setHeaderView: any, navigation: GetStartedNavigationProp }
export const LoginHeader = ({ setHeaderView, navigation }: LoginHeader_t) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const _log: logFun_t = (s) => {
        console.log("< LOGIN HEADER > " + s);
    }


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
                    Let's start with Login
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
                    Your HUElite Account is required to setup your devices with Alexa and
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
                        setPassword(text);
                    }}
                    placeholder="password"
                    value={password}
                    secureTextEntry={true}
                />

                <RectButton
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
                    onPress={async () => {
                        login({ email, password, navigation }, _log)
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                        Login
          </Text>
                </RectButton>
            </View>
            <RectButton
                style={{ marginTop: "5%" }}
                onPress={() => {
                    console.log("Signup");
                    setHeaderView(2)
                }}
            >
                <Text style={{ textAlign: "center" }}>
                    Dont have an account
            <Text style={{ color: "#5555ff", fontWeight: "bold" }}>SignUP</Text>
                </Text>
            </RectButton>
        </View>
    )
}


/**
 * 
 * //TODO email validation before signing up
 * //TODO retype pass must match before procceding
 */
interface SignUpHeader_t { setHeaderView: any, navigation: GetStartedNavigationProp }
export const SignUpHeader = ({ setHeaderView, navigation }: SignUpHeader_t) => {
    const user = useSelector((state: _appState) =>
        state.appCTXReducer.user
    );
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");

    const _log: logFun_t = (s) => {
        console.log("< SIGNUP INDEX > " + s);
    }

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

                <RectButton
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
                        if (password != re_password) {
                            Alert.alert("Password Mismatch", "'password' & 're-type password' fields must match in case sensitive manner")
                        }
                        else if (false/* //TODO email validation check*/) {

                        } else if (password != password.trim()) {
                            Alert.alert("Not Allowed whitespace in password field", "whitespace in password could be security leak, try a password without whitespaces")
                        } else {
                            signUp({ email, password, navigation }, _log)
                        }
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
                    setHeaderView(1)
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