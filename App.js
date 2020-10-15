import 'react-native-gesture-handler';
import React from 'react'
import Amplify from 'aws-amplify'
import config from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'
import store from './src/redux/store';
import { Provider } from 'react-redux';
import NewProductForm from './screens/NewProductForm'
import ProductList from './screens/ProductList'
import ProductCategory from './screens/ProductCategory'
import NewGroceryListForm from './screens/NewGroceryListForm'
import AllGroceryLists from './screens/AllGroceryLists'
import GroceryLists from './screens/GroceryLists'
import Home from './screens/Home'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useCachedResources from './hooks/useCachedResources';
import RoundButton from './components/RoundButton';

Amplify.configure({...config,
  Analytics: { 
    disabled: true
  }
})

const ProductStack = createStackNavigator();


const App = () => {
  const isLoadingComplete = useCachedResources();

  function goToNewProductScreen (props) {
    props.navigation.push('AddProduct',{
      category: props.route.params.category,
      groceryListID: props.route.params.groceryListID
    })
  }


  if (!isLoadingComplete) {
    return null;
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ProductStack.Navigator>
          <ProductStack.Screen 
            name="Home" 
            component={Home} 
            options={{ title: 'Home' }}/>
          <ProductStack.Screen 
            name="ProductCategory" 
            component={ProductCategory} 
            options={{ title: 'My Grocery List' }}/>
          <ProductStack.Screen 
            name="NewList" 
            component={NewGroceryListForm} 
            options={{ title: 'My New List' }}/>
          <ProductStack.Screen 
            name="AllGroceryLists" 
            component={AllGroceryLists} 
            options={{ title: 'All Grocery Lists' }}/>
          <ProductStack.Screen 
            name="GroceryLists" 
            component={GroceryLists} 
            options={{ title: 'My Saved Lists' }}/>
          <ProductStack.Screen 
            name="ProductList" 
            component={ProductList} 
            options={(props) => ({
              title: props.route.params.category,
              headerRight: () => (
                <RoundButton
                  onPress={() => goToNewProductScreen(props)}
                  name="pluscircle"
                  color="green"
                  style={{marginRight: 20}}
                />
                ),
              })}
            />
          <ProductStack.Screen 
            name="AddProduct" 
            component={NewProductForm} 
            options={(props) => ({
              title: `Add New ${props.route.params.category}`,
              })}/>
        </ProductStack.Navigator>
      </NavigationContainer>
    </Provider>
      
  )
  
}

export default withAuthenticator(App)