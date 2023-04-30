import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]); //Состаяние  корзины
  const [favorites, setFavorites] = React.useState([]); //Состояние закладок(сердечек)
  const [searchValue, setSearchValue] = React.useState(""); // Состаяние инпута
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    //что бы не отправлялся запрос на бэк постоянно оборачиваем в React.useEffect()

    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] =
          await Promise.all([
            axios.get("https://644e21cf1b4567f4d580793f.mockapi.io/cart"),
            axios.get("https://640889942f01352a8a95d5d7.mockapi.io/favorites"),
            axios.get("https://644e21cf1b4567f4d580793f.mockapi.io/items"),
          ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("ошибка при запросе данных");
      }
    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://644e21cf1b4567f4d580793f.mockapi.io/cart/${findItem.id}`
        );
      } else {
       
        //ждём ответ с бэка
        const { data } = await axios.post(
          "https://644e21cf1b4567f4d580793f.mockapi.io/cart",
          obj
        );//сохраняем в корзине
        setCartItems((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не поллучилось добавить в корзину");
      console.error(error);
    }
  };
  //удаляем товары
  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://644e21cf1b4567f4d580793f.mockapi.io/cart/${id}`); //удаляем с бэка
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Ошибка при удалении из корзины");
      console.error(error);
    }
  };

  //сердечки
  const onAddToFavorite = async (obj) => {
    //проверяем если есть элемент в избранных, то его удаляем из избранного
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://640889942f01352a8a95d5d7.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        //если нет в избранном с таким id, то создаём
        const { data } = await axios.post(
          "https://640889942f01352a8a95d5d7.mockapi.io/favorites",
          obj
        ); //сохраняем избраное в корзине на бэке
        setFavorites((prev) => [...prev, data]); //отображаем избраное
      }
    } catch (error) {
      alert("Не удалось добавить в избранное");
      console.error(error);
    }
  };

  //Инпут
  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value); //что введено в инпуте
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <div>
          <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
          />
        </div>

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path=""
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />
          <Route path="favorites" exact element={<Favorites />} />
          <Route path="orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
