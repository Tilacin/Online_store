import React from 'react'
import styles from "./Card.module.scss";

function Card({onFavorite,title,imageUrl,price,onPlus}) {
const [isAdded, setIaAdded] = React.useState(false)

const onClickPlus = () => {
  onPlus({title,imageUrl,price})
  setIaAdded(!isAdded)//если была true, станет false и на оборот
}

  return (
    <div className={styles.card}>
      <div className={styles.favorite} onClick={onFavorite}>
        <img src="/img/heart-off.svg" alt="Unliked" />
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
          src={isAdded ? "/img/btn-checked.svg":"/img/btn-plus.svg"}
          alt="Plus"
        />
      </div>
    </div>
  );
}

export default Card;
