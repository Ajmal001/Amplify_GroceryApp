import { DataStore } from "@aws-amplify/datastore";
import { User, GroceryList, Product, UserGroceryListJoin } from "../src/models";
import { Auth } from "aws-amplify";

export class BackendInterface {
  constructor(dataStore) {
      this._dataStore = dataStore
  }
 async identifyUser() {
    try {
      const userInfo = await Auth.currentUserInfo();
      const result = await DataStore.query(User, (c) =>
        c.sub("eq", userInfo.attributes.sub,)
      );
  
      let currentUser = result[0]
      if (currentUser === undefined){
        currentUser = await createUser(userInfo)
      }
      
      console.log("User info retrieved successfully!");
      return currentUser
    } catch (error) {
      console.log("Error retrieving user info", error);
    }
  }
  
  async createUser(userInfo) {
    try {
      const userDetails = {
        sub: userInfo.attributes.sub,
      };
      const newUser = await DataStore.save(new User(userDetails));
      console.log("new User created successfully", newUser);
      return newUser;
    } catch (err) {
      console.log("error creating new User", err);
    }
  }
  
 async fetchAllGroceryLists() {
    try {
      const allGroceryLists = await DataStore.query(GroceryList);
      console.log("grocery lists retrieved successfully!");
      return allGroceryLists;
    } catch (error) {
      console.log("Error retrieving grocery lists", error);
    }
  }
  
 async removeGroceryListFromUser(id, user) {
      try {
        const result = (await DataStore.query(UserGroceryListJoin))
        .filter(c => c.groceryList.id === id)
        .filter(c => c.user.id === user.id)
        DataStore.delete(result[0]);
        console.log("Grocery list deleted from User successfully!");
      } catch (err) {
        console.log("error deleting list", err);
      }
    }
  
   async fetchUserGroceryLists(user) {
      try {
          const result = (await DataStore.query(UserGroceryListJoin)).filter(c => c.user.id === user.id)
          const groceryListsPerUser = result.map(element => element.groceryList) || []
          console.log("grocery lists retrieved successfully!");
          return groceryListsPerUser
      } catch (error) {
        console.log("Error retrieving grocery lists", error);
      }
    }
  
   async addGroceryListToUser(groceryListID, currUser) {
      try {
        const user = await DataStore.query(User, currUser.id)
        const groceryList = await DataStore.query(GroceryList, groceryListID)
        await DataStore.save(
          new UserGroceryListJoin({
            user,
            groceryList
          })
        )
        console.log("Grocery list added to user successfully!");
        return groceryList
      } catch (error) {
        console.log("Error adding grocery list to user", error);
      }
    }
  
  
   async createNewGroceryList (groceryList, currentUser) {
      try {
        const groceryListSaved = await DataStore.save(
        new GroceryList({
          name: groceryList.name,
          description: groceryList.description,
        })
      );
      
      const user = await DataStore.query(User, currentUser.id)
  
      await DataStore.save(
        new UserGroceryListJoin({
          user,
          groceryList: groceryListSaved
        })
      )
      console.log("List saved successfully!");
      return groceryListSaved
    } catch (err) {
      console.log("error creating list:", err);
    }
  }
 async createNewProduct(product, groceryListID) {
    try {
      // Retrieve List object
      const currentList = await DataStore.query(GroceryList, groceryListID);
      // Add reference
      product.groceryList = currentList;
      const productSaved = await DataStore.save(new Product(product));
      console.log("Product saved successfully!", productSaved);
      return productSaved
    } catch (err) {
      console.log("error creating food:", err);
    }
  }
  
  
 async updateProductDetails(product) {
    try {
      const original = await DataStore.query(Product, product.id);
      const updatedProduct =  await DataStore.save(
        Product.copyOf(original, (updated) => {
          updated.checked = product.checked
          updated.name = product.name
          updated.unit = product.unit
          updated.quantity = product.quantity
        }))
        console.log("Product updated successfully!", updatedProduct);
        return updatedProduct
     } catch (err) {
    console.log("error creating food:", err);
    }
  }
  
 async  fetchProductsByGroceryList(groceryListID) {
    try {
      const data = (await DataStore.query(Product)).filter(
        (c) => c.groceryList.id === groceryListID
      );
      console.log("products retrieved successfully!");
      return data
    } catch (error) {
      console.log("Error retrieving products", error);
    }
  }
  
 async removeProduct(id) {
    try {
      const todelete = await DataStore.query(Product, id);
      DataStore.delete(todelete);
    } catch (err) {
      console.log("error deleting product", err);
    }
  }
}

export const API = new BackendInterface(DataStore)