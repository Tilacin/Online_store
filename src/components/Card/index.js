import styles from "./Card.module.scss";


function Card(props) {


  return (
    <div className={styles.card}>
      <div className={styles.favorite}>
        <img src="/img/heart-off.svg" alt="Unliked" />
      </div>
      <img width={133} height={112} src={props.imageUrl} alt="Sneakers" />
      <h5>{props.title}</h5>
      <div className="d-flex justify-between align-center">
        <div className="d-flex flex-column ">
          <span>Цена:</span>
          <b>{props.price} руб.</b>
        </div>
        <buttton className="button">
          <img width={31} height={31} src="/img/plus.svg" alt="Plus" />
        </buttton>
      </div>
    </div>
  );
}

export default Card;
