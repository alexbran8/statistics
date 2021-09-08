
import React from "react";
import { useHistory } from "react-router-dom";
import { UPDATE_PROFILE_TYPE } from '../redux/reducers/types'
import { useSelector, useDispatch } from "react-redux";
import { config } from "../config"

import "./Landingpage.scss"

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';



const Landingpage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => ({ auth: state.auth }));

  const cardClick = (resource_origin) => {
    dispatch({
      type: UPDATE_PROFILE_TYPE,
      payload: {
        type: resource_origin,
      },
    });
    history.push('/home');
  }
  return (
    <div className="home-container">
      <div>
        {!user.auth.token ? (
          <div>
            <div className="card-container">
              <a style={{ cursor: 'pointer' }} onClick={() => { cardClick('student') }}>
                <Card className="card-item">
                  <CardBody>
                    <CardTitle className="card-title">student</CardTitle>
                    <CardText className="text-muted">Select this if you are stundent at University</CardText>
                  </CardBody>
                </Card>
              </a>
              <a style={{ cursor: 'pointer' }} onClick={() => { cardClick('nokia') }}>
                <Card className="card-item">
                  <CardBody>
                    <CardTitle className="card-title">Nokia tentant</CardTitle>
                    <CardText className="text-muted">Select this if you are a nokia employee / guest </CardText>
                  </CardBody>
                </Card>
              </a>
            </div>
          </div>

        ) : (
          <div>
            <h1>{user.auth.name}, you have been logeed in succcessfully!</h1>
            <Button onClick={() => { cardClick(user.auth.type) }}>Continue here ...</Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Landingpage;