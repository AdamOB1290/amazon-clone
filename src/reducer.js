export const initialState = {
  basket: [],
  user: null,
  username: null,
};

//   Selector
export const getBasketTotal = (basket) =>
  //   reduce() iterates through the basket and adds up the total
  basket?.reduce((amount, item) => parseInt(item.price) + amount, 0);

export const getStarTotal = (array) =>
  //   reduce() iterates through the basket and adds up the total
  array?.reduce((amount, item) => item + amount, 0);

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        );
      }

      return {
        ...state,
        basket: newBasket,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
        username: action.username,
      };
    default:
      return state;
  }
};

export default reducer;
