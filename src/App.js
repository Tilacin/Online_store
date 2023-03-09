import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]); //Состаяние  карзины
  const [favorites, setIsFavorites] = React.useState([]); //Состояние закладок(сердечек)
  const [searchValue, setSearchValue] = React.useState(""); // Состаяние инпута
  const [cartOpened, setCartOpened] = React.useState(false);
  React.useEffect(() => {
    //что бы не отправлялся запрос на бэк постоянно оборачиваем в React.useEffect()
    axios //при первом рендинге отправляем запрос на получение всех кроссовок с сервера
      .get("https://6401bfb73779a862625cf291.mockapi.io/items")
      .then((res) => {
        setItems(res.data);
      });
    axios //отправляем запрос на получение  кроссовок из корзины с сервера
      .get("https://6401bfb73779a862625cf291.mockapi.io/cart")
      .then((res) => {
        setCartItems(res.data);
      });
    axios //отправляем запрос на избранного с сервера
      .get("https://640889942f01352a8a95d5d7.mockapi.io/favorites")
      .then((res) => {
        setIsFavorites(res.data);
      });
  }, []);
  //Корзина
  const onAddToCart = (obj) => {
    axios
      .post("https://6401bfb73779a862625cf291.mockapi.io/cart", obj) //сохраняем товары в корзине на бэке
      .then((res) => setCartItems((prev) => [...prev, res.data])); //отображаем товары в корзине с бэка
  };
  //удаляем товары
  const onRemoveItem = (id) => {
    axios.delete(`https://6401bfb73779a862625cf291.mockapi.io/cart/${id}`); //удаляем с бэка
    setCartItems((prev) => prev.filter((item) => item.id !== id)); //удаляем с фронта
  };

  //сердечки
  const onAddToFavorite = async (obj) => {
    //проверяем если есть элемент в избранных, то его удаляем из избранного
    try {
    if (favorites.find((favObj) => favObj.id === obj.id)) {
      axios.delete(
        `https://640889942f01352a8a95d5d7.mockapi.io/favorites/${obj.id}`
      );
      //setIsFavorites((prev) => prev.filter((item) => item.id !== obj.id));
    } else {
      //если нет в избранном с таким id, то создаём
      const { data } = await axios.post(
        "https://640889942f01352a8a95d5d7.mockapi.io/favorites",
        obj
      ); //сохраняем избраное в корзине на бэке
      setIsFavorites((prev) => [...prev, data]); //отображаем избраное
    }
    }catch (err) {
      alert("Не удалось добавить в избранное")
    }
  };

  //Инпут
  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value); //что введено в инпуте
  };

  return (
    <div className="wrapper clear">
      {cartOpened ? (
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
        />
      ) : null}
      <Header onClickCart={() => setCartOpened(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onAddToCart={onAddToCart}
              onAddToFavorite={onAddToFavorite}
              onChangeSearchInput={onChangeSearchInput}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites items={favorites} onAddToFavorite={onAddToFavorite} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
