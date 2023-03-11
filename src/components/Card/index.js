import React from "react";
import styles from "./Card.module.scss";

function Card({
  id,
  title,
  imageUrl,
  price,
  onFavorite,
  onPlus,
  favorited = false,
}) {
  const [isAdded, setIsAdded] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(favorited); //состояние сердечка

  const onClickPlus = () => {
    onPlus({ id, title, imageUrl, price });
    setIsAdded(!isAdded); //если была true, станет false и на оборот
  };

  const onClickFavorite = () => {
    onFavorite({ id, title, imageUrl, price });
    setIsFavorite(!isFavorite); //при нажатии на сердечко,если не выбрано выбирается и наоборот
  };

  return (
    <div className={styles.card}>
      <div className={styles.favorite} onClick={onClickFavorite}>
        <img
          src={isFavorite ? "/img/heart-on.svg" : "/img/heart-off.svg"}
          alt="Unliked"
        />
      </div>
      <img width={133} height={112} src={imageUrl} alt="Sneakers" />
      <h5>{title}</h5>
      <div className="d-flex justify-between align-center">
        <div className="d-flex flex-column ">
          <span>Цена:</span>
          <b>{price} руб.</b>
        </div>

        <img
          className={styles.plus}
          onClick={onClickPlus}
          width={31}
          height={31}
          src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"}
          alt="Plus"
        />
      </div>
    </div>
  );
}

export default Card;
