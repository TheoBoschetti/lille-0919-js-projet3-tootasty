import React from "react";
import { Link } from "react-router-dom";
import "./styles/ProfileCard.scss";

function ProfileCard(props) {
  return (
    <article className="ProfileCardBlue">
      <Link to={`/${props.url}/${props.id}`}>
        <figure>
          <img src={props.img} alt={props.name} />
        </figure>
        <div className="blueContent">
          <h3>{props.name}</h3>
        </div>
      </Link>
    </article>
  );
}

export default ProfileCard;
