import "babel-polyfill";
import React from "react";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import store from "./src/redux/store";
import { Provider } from "react-redux";
import NewProductForm from "./screens/NewProductForm";
import ProductList from "./screens/ProductList";
import ProductCategory from "./screens/ProductCategory";
import NewGroceryListForm from "./screens/NewGroceryListForm";
import AllGroceryLists from "./screens/AllGroceryLists";
import GroceryLists from "./screens/GroceryLists";
import Home from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import useCachedResources from "./hooks/useCachedResources";
import RoundButton from "./components/RoundButton";
import syncDatastore from "./hooks/syncDatastore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Settings from "./screens/Settings";

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const ProductStack = createStackNavigator();

const App = () => {
  const isLoadingComplete = useCachedResources();
  const isSyncComplete = syncDatastore()
  function goToNewProductScreen(props) {
    props.navigation.push("AddProduct", {
      category: props.route.params.category,
      groceryListID: props.route.params.groceryListID,
    });
  }

  function goToSettings(props) {
    props.navigation.push("Settings")
  }
  if (!isLoadingComplete || !isSyncComplete) {
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ProductStack.Navigator>
          <ProductStack.Screen
            name="Home"
            component={Home}
            options={(props) => ({
              title: "Home",
              headerRight: () => (
                <MaterialCommunityIcons
                  onPress={() => goToSettings(props)}
                  name="settings-outline"
                  size={20}
                  style={{ marginRight: 20 }}
                />
              ),
            })}
          />
          <ProductStack.Screen
            name="ProductCategory"
            component={ProductCategory}
            options={(props) => ({
              title: `${props.route.params.groceryList.name}`,
            })}
          />
          <ProductStack.Screen
            name="NewList"
            component={NewGroceryListForm}
            options={{ title: "My New List" }}
          />
          <ProductStack.Screen
            name="AllGroceryLists"
            component={AllGroceryLists}
            options={{ title: "All Grocery Lists" }}
          />
          <ProductStack.Screen
            name="GroceryLists"
            component={GroceryLists}
            options={{ title: "My Saved Lists" }}
          />
          <ProductStack.Screen
            name="ProductList"
            component={ProductList}
            options={(props) => ({
              title: props.route.params.category,
              headerRight: () => (
                <RoundButton
                  onPress={() => goToNewProductScreen(props)}
                  name="plus-circle"
                  color="green"
                  style={{ marginRight: 20 }}
                />
              ),
            })}
          />
          <ProductStack.Screen
            name="AddProduct"
            component={NewProductForm}
            options={(props) => ({
              title: props.route.params.product?
              `Update ${props.route.params.product.name}`
              : `Add New ${props.route.params.category}`,
            })}
          />
          <ProductStack.Screen
            name="Settings"
            component={Settings}
            options={(props) => ({
              title: "Settings"
            })}
          />
        </ProductStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default withAuthenticator(App);
