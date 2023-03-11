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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => { //что бы не отправлялся запрос на бэк постоянно оборачиваем в React.useEffect()
   
   async function fetchData () {
    setIsLoading(true)//перед тем как отправить запросы покажим пустые карточки
    //вытаскиваем данные с сервера
     const cartResponse = await axios.get("https://6401bfb73779a862625cf291.mockapi.io/cart")
     const favoritesResponse = await axios.get("https://640889942f01352a8a95d5d7.mockapi.io/favorites")
     const itemsResponse = await axios.get("https://6401bfb73779a862625cf291.mockapi.io/items")
     
     setIsLoading(false)

    //сохраняем данные
     setCartItems(cartResponse.data);
     setIsFavorites(favoritesResponse.data);
     setItems(itemsResponse.data)
    
   }
   fetchData()
  }, []);
  //Корзина
  const onAddToCart = (obj) => {
    console.log(obj.title)
    console.log(cartItems)
   try {
    if(cartItems.find((item) => item.title === obj.title)) { //убираем дубли при добавлении в корзину
      axios.delete(`https://6401bfb73779a862625cf291.mockapi.io/cart/${obj.title}`); //удаляем с бэка
      setCartItems(prev => prev.filter(item => item.title !== obj.title ))
    }else {
    axios
    .post("https://6401bfb73779a862625cf291.mockapi.io/cart", obj)//сохраняем товары в корзине на бэке
    setCartItems((prev) => [...prev, obj])
    
   // .then((res) => setCartItems((prev) => [...prev, res.data])); //отображаем товары в корзине с бэка
  }
   } catch (error) {
    alert('Проблемы с корзиной')
   }
  };
  //удаляем товары
  const onRemoveItem = (title) => {
    
    axios.delete(`https://6401bfb73779a862625cf291.mockapi.io/cart/${title}`); //удаляем с бэка
    setCartItems((prev) => prev.filter((item) => item.title !== title )); //удаляем с фронта
   
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
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToCart={onAddToCart}
              onAddToFavorite={onAddToFavorite}
              isLoading={isLoading}
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
