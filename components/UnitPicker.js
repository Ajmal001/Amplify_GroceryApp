import React, { forwardRef } from 'react'
import {Text, TouchableOpacity, StyleSheet } from 'react-native'
import { lightGreen, grey } from '../utils/colors'
import PropTypes from 'prop-types'
import {Picker} from '@react-native-community/picker';


export default function UnitPicker({ selectedValue, onValueChange, value, units}) {
    return (
         <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={onValueChange}
        >
        <Picker.Item label={value} value={value} />
        {units.filter(unit => unit !== value).map(unit => (
        <Picker.Item label={unit} value={unit} key={unit} />
        ))}
        
    </Picker>
    )
}




const styles = StyleSheet.create({
    picker: {
        height: 40,
        borderColor: grey,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
    },
});

UnitPicker.propTypes = {
    selectedValue: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    units: PropTypes.array.isRequired,
}