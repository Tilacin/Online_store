import Card from "./components/Card";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import React from "react";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);//массив для карзины
  const [cartOpened, setCartOpened] = React.useState(false);
React.useEffect(() => {//что бы не отправлялся запрос на бэк постоянно оборачиваем в React.useEffect()
//Отправляем запрос на сервер, ответ превращаем в json формат
fetch("https://6401bfb73779a862625cf291.mockapi.io/items")
.then((res) => {
  return res.json();
})//передаём его в функцию 
.then((json) => {
  setItems(json);
});
}, [])

 const onAddToCart = (obj) => {
  setCartItems(prev =>[...prev, obj])
 }

  return (
    <div className="wrapper clear">
      {cartOpened ? <Drawer items={cartItems} onClose={() => setCartOpened(false)} /> : null}
      <Header onClickCart={() => setCartOpened(true)} />
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>Все кроссовки</h1>
          <div className="search-block d-flex">
            <img src="/img/search.svg" alt="Search" />
            <input placeholder="Поиск..." />
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {items.map((item) => (
            <Card
              title={item.title}
              price={item.price}
              imageUrl={item.imageUrl}
              onFavorite={() => console.log("Добавили в закладки")}
              onPlus={(obj) => onAddToCart(obj)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
