import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { GARBAGE , TRASH } from './data';
import { shuffle, getTimeLeft, getTotalScore, move, GAME_STATE } from './utils';

import Modal from './Modal';
import Header from './Header';
import Dropzone from './Dropzone';
import Scores from './Scores';
import { io } from 'socket.io-client';

const GAME_DURATION = 1000 * 30; // 30 seconds

const initialState = {
  // we initialize the state by populating the bench with a shuffled collection of heroes
  bench: shuffle(TRASH),
  [GARBAGE.GARBAGE]: [],
  [GARBAGE.RECYCLABLE]: [],
  [GARBAGE.COMPOST]: [],
  gameState: GAME_STATE.READY,
  timeLeft: 0,
  scores: []
};

initialState["userName"] = "";

const socket = io();

class App extends Component {
  state = initialState;

  onChange = (event) => {
    this.setState(
      {userName: event.target.value}
    );
  }

  startGame = () => {
    if (this.state.userName === "") {
      return;
    }
    socket.emit('sendUsername', this.state.userName);

    this.currentDeadline = Date.now() + GAME_DURATION;
    this.setState(
      {
        gameState: GAME_STATE.PLAYING,
        timeLeft: getTimeLeft(this.currentDeadline),
      },
      this.gameLoop
    );
  };

  gameLoop = () => {
    this.timer = setInterval(() => {
      const timeLeft = getTimeLeft(this.currentDeadline);
      const isTimeout = timeLeft <= 0;
      if (isTimeout && this.timer) {
        clearInterval(this.timer);
      }

      this.setState({
        timeLeft: isTimeout ? 0 : timeLeft,
        ...(isTimeout ? { gameState: GAME_STATE.DONE } : {}),
      });
    }, 1000);
  };

  endGame = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.setState({
      gameState: GAME_STATE.DONE,
    });
  };

  resetGame = () => {
    this.setState(initialState);
  };

  onDragEnd = ({ source, destination }) => {
    if (!destination) {
      return;
    }

    this.setState(state => {
      return move(state, source, destination);
    }, () => {
      const { gameState, timeLeft, bench, ...groups } = this.state;
      socket.emit('updateMyScore', getTotalScore(groups, timeLeft))
    });
  };

  render() {
    const { gameState, timeLeft, bench, scores, ...groups } = this.state;
    const isDropDisabled = gameState === GAME_STATE.DONE;

    return (
          <>
            <Header gameState={gameState} timeLeft={timeLeft} endGame={this.endGame} />
            {this.state.gameState !== GAME_STATE.PLAYING && (
              <Modal
                startGame={this.startGame}
                resetGame={this.resetGame}
                timeLeft={timeLeft}
                gameState={gameState}
                groups={groups}
                userName = {this.userName}
                onChange = {this.onChange}
              />
            )}
            
            {(this.state.gameState === GAME_STATE.PLAYING ||
              this.state.gameState === GAME_STATE.DONE) && (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="container">
                  <div className="columns">
                    <Dropzone 
                      id="bench" 
                      trash={bench} 
                      isDropDisabled={isDropDisabled} 
                    />
                    <div className="column col-9" style={{display: "flex", flexDirection: "column"}}>
                      <div className="rows">
                        <Scores scores={scores}></Scores>
                      </div>
                      <div className="columns" style={{flexGrow: 1}}>
                        <Dropzone
                          id={GARBAGE.GARBAGE}
                          trash={this.state[GARBAGE.GARBAGE]}
                          isDropDisabled={isDropDisabled}
                        />
                        <Dropzone
                          id={GARBAGE.RECYCLABLE}
                          trash={this.state[GARBAGE.RECYCLABLE]}
                          isDropDisabled={isDropDisabled}
                        />
                        <Dropzone
                          id={GARBAGE.COMPOST}
                          trash={this.state[GARBAGE.COMPOST]}
                          isDropDisabled={isDropDisabled}
                        />
                      </div>
                      
                    </div>

                  </div>
                </div>
              </DragDropContext>
            )}
          </>
        );
      }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidMount() {
    socket.on('scoresUpdated', (newScores) => {
      this.setState(newScores, () => {console.log(this.state.scores)});
    });
  }
}

export default App;
