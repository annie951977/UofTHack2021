import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { GARBAGE , TRASH } from './data';
import { shuffle, getTimeLeft, move, GAME_STATE } from './utils';

import Modal from './Modal';
import Header from './Header';
import Dropzone from './Dropzone';

const GAME_DURATION = 1000 * 30; // 30 seconds

const initialState = {
  // we initialize the state by populating the bench with a shuffled collection of heroes
  bench: shuffle(TRASH),
  [GARBAGE.GARBAGE]: [],
  [GARBAGE.RECYCLABLE]: [],
  [GARBAGE.COMPOST]: [],
  gameState: GAME_STATE.READY,
  timeLeft: 0,
};

class App extends Component {
  state = initialState;
  
  startGame = () => {
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
    });
  };

  render() {
    const { gameState, timeLeft, bench, ...groups } = this.state;
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
              />
            )}
            {(this.state.gameState === GAME_STATE.PLAYING ||
              this.state.gameState === GAME_STATE.DONE) && (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="container">
                  <div className="rows"></div>
                  <div className="columns">
                    <Dropzone 
                      id="bench" 
                      heroes={bench} 
                      isDropDisabled={isDropDisabled} 
                    />
                    <Dropzone
                      id={GARBAGE.GARBAGE}
                      heroes={this.state[GARBAGE.GARBAGE]}
                      isDropDisabled={isDropDisabled}
                    />
                    <Dropzone
                      id={GARBAGE.GARBAGE}
                      heroes={this.state[GARBAGE.GARBAGE]}
                      isDropDisabled={isDropDisabled}
                    />
                    <Dropzone
                      id={GARBAGE.GARBAGE}
                      heroes={this.state[GARBAGE.GARBAGE]}
                      isDropDisabled={isDropDisabled}
                    />
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
}

export default App;
