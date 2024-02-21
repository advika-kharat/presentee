import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function LandingPageNavbar() {
  return (
    <View style={styles.navbar}>
        <Image
          source={require('./assets/logo2.png')}
          style={styles.navbarLogo}
        />
        <Text style={styles.navbarText}>presentee</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    navbar: {
        height: '40%',
        padding: 8,
        paddingTop: 20,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        },
        navbarLogo: {
        height: 200,
        width: 200,
        },
        navbarText: {
        fontSize: 40,
        fontWeight: 'bold',
        }
})