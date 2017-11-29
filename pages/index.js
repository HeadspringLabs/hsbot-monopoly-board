/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import External from '../external';
import { coordinates } from '../constants';

import stylesheet from '../styles/board.scss';


class Board extends React.Component {
  static async getInitialProps() {
    const res = await External.getData().catch(err => console.error(err));
    return {
      players: res.body._private.monopolyPlayers,
      board: res.body._private.monopolyBoard
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      players: props.players,
      board: props.board
    };
  }

  componentDidMount() {
    this.renderPieces();
    setInterval(this.getCurrentData, 60000);
  }

  renderPieces = () => {
    const canvas = document.getElementById('game-pieces');
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const dallas = new Image();
    const houston = new Image();
    const dmz = new Image();
    const deltaCity = new Image();
    const gotham = new Image();
    const monterrey = new Image();
    dallas.src = '../static/Dallas.png';
    houston.src = '../static/Houston.png';
    dmz.src = '../static/DMZ.png';
    deltaCity.src = '../static/DeltaCity.png';
    gotham.src = '../static/Gotham.png';
    monterrey.src = '../static/Monterrey.png';

    this.renderPiece(0, deltaCity, context);
    this.renderPiece(1, gotham, context);
    this.renderPiece(2, dmz, context);
    this.renderPiece(3, houston, context);
    this.renderPiece(4, dallas, context);
    this.renderPiece(5, monterrey, context);
  }

  getCurrentData = () => {
    External.getData()
    .then(result =>
      this.setState({
        players: result.body._private.monopolyPlayers
      }, this.renderPieces)
    ).catch(err => console.error(err));
  }

  renderPiece = (playerIndex, image, context) => {
    const player = this.state.players[playerIndex];
    if (!player.isBankrupt) {
      const x = this.calculateX(playerIndex, player.location);
      const y = this.calculateY(playerIndex, player.location);
      context.drawImage(image, x, y, 60, 60);
    }
  }

  calculateX = (index, location) => {
    const inJail = this.state.players[index].inJail;
    let position = inJail ? 28 : coordinates[location].x;
    let piecesAtThatLocation = 0;
    for (let i = 0; i < index; i += 1) {
      const checkPlayer = this.state.players[i];
      if (checkPlayer.location === location && !checkPlayer.isBankrupt && checkPlayer.inJail === inJail) {
        piecesAtThatLocation += 1;
      }
    }
    if (piecesAtThatLocation > 0) {
      if (location === 0 || (location > 10 && location <= 20) || (!inJail && location === 10)) {
        // stack left to right
        position += piecesAtThatLocation * 50;
      } else if (location > 30) {
        // stack right to left
        position -= piecesAtThatLocation * 50;
      } else if (inJail) {
        position += piecesAtThatLocation * 10;
      }
    }
    return position;
  }

  calculateY = (index, location) => {
    const inJail = this.state.players[index].inJail;
    let position = inJail ? 600 : coordinates[location].y;
    let piecesAtThatLocation = 0;
    for (let i = 0; i < index; i += 1) {
      const checkPlayer = this.state.players[i];
      if (checkPlayer.location === location && !checkPlayer.isBankrupt) {
        piecesAtThatLocation += 1;
      }
    }
    if (piecesAtThatLocation > 0) {
      if (location < 10 && location > 0) {
        // stack above
        position -= piecesAtThatLocation * 50;
      } else if (location < 30 && location > 20) {
        // stack below
        position += piecesAtThatLocation * 50;
      }
    }
    return position;
  }

  renderStatus = () => this.state.players.map((player) => {
    let location = `is on ${this.state.board[player.location].name}`;
    if (player.isBankrupt) {
      location = 'is bankrupt 😢';
    }
    return <div key={player.name} className="team-status">{player.name} {location}</div>;
  })

  render() {
    return (
      <div>
        <Head>
          <title>Headspringopoly Board</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        </Head>
        <img alt="board" className="board" src="../static/HeadspringopolyBoard.png" />
        <canvas id="game-pieces" height="700" width="700" />
        <div className="status">
          {this.renderStatus()}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  players: PropTypes.array,
  board: PropTypes.array
};

Board.defaultProps = {
  players: [],
  board: []
};

export default Board;
