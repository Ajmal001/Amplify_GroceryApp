import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { connect, useDispatch } from "react-redux";
import { HelperText } from 'react-native-paper';
import SubmitBtn from "../components/SubmitBtn";
import StyledTextInput from "../components/StyledTextInput";
import { handleAddGroceryList } from "../src/redux/actions/groceryList";
import { API } from "../utils/api";



const JoinGroceryList = ({navigation, userGroceryLists}) => {
  const [groceryListID, setGroceryListID] = useState('');
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertText, setAlertText] = useState('')

  const dispatch = useDispatch();

  const incorrectLength = () => {
    return groceryListID.length !== 36;
  };
  async function addGroceryList() {
    // Check if user has already access to the grocery list:
    if (userGroceryLists.includes(groceryListID)){
      setAlertText('This Grocery List has already been added')
      return setAlertVisible(true)
    }
    // Check if grocerylist exists:
    const validityCheck = await API.fetchGroceryListByID(groceryListID)
    if (!validityCheck){
      setAlertText('Please enter a valid Grocery List ID')
      setAlertVisible(true)
    } else {
      dispatch(handleAddGroceryList(groceryListID))
      navigation.goBack();
    }
   
  }

  return (
    <View style={styles.container}>
      <View>
        <StyledTextInput
          onChangeText={(val) => setGroceryListID(val)}
          style={styles.input}
          value={groceryListID}
          placeholder="Grocery List ID"
        />
        <HelperText type="error" visible={alertVisible} style={{textAlign: 'center'}}>
          {alertText}
        </HelperText>
      </View>
      
      <SubmitBtn title="Join List" onPress={addGroceryList} disabled={incorrectLength()}/>
    </View>
  );
};
const mapStateToProps = (state) => ({
  userGroceryLists: state.user.groceryLists,
});

export default connect(mapStateToProps)(JoinGroceryList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    padding: 20,
  },
  input: { height: 50, backgroundColor: "#ddd", marginBottom: 10, padding: 8 },
});