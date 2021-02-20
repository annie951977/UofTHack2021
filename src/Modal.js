import React from 'react';

import { GAME_STATE, getTotalScore } from './utils';
const Modal = ({ gameState, groups, startGame, timeLeft, resetGame, userName, onChange }) => (
  <div className="modal modal-sm active">
    <div className="modal-overlay" />
    <div className="modal-container">
      <div className="modal-header">
        <div className="modal-title h4">Sort the Trash!</div>
      </div>
      <div className="modal-body">
        <div className="content h6">
          {' '}
          {gameState === GAME_STATE.READY
            ? `Sort the trash to garbage, recyclables, and compost! Sort them alphabetically and quickly for better score...`
            : `You scored - ${getTotalScore(groups, timeLeft)}`}
        </div>
        <form id="username-form" onSubmit={gameState === GAME_STATE.READY ? startGame : resetGame}>
        {gameState === GAME_STATE.READY && (
            <input className="form-input" style={{marginTop: "25px"}} type="text" value={userName==="" ? null : userName} placeholder="Username" onChange={onChange}></input>
        )}
        </form>
        
      </div>
      <div className="modal-footer">
      
        <button
          form="username-form"
          className="btn btn-primary"
        >
          {gameState === GAME_STATE.READY ? 'Start new game' : 'Restart game'}
        </button>
      </div>
    </div>
  </div>
);

export default Modal;