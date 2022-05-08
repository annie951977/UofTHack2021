import React from 'react';
import {maxPossibleScore} from './data';

const Score = (userName, score) => {
    // <svg></svg>
}

const Scores = ({scores}) => {

    console.log(scores);
    let count = scores.length;
    return (
<React.Fragment>
    {(scores.map(elem => {
        
        console.log(String(elem.score*100/maxPossibleScore) + "%");
        return (
            <div class="progress" style={{height: "40px", position: "relative", marginLeft: "110px", borderBottom: "dashed orange 3px", paddingTop: "5px"}}>
                <div style={{left: String(elem.score*100/maxPossibleScore) + "%", position: "absolute", transform: "translate(-100%, 0)"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>

                    <div style={{color: "black", padding: "5px", width: "100px", textAlign: "end"}}>{elem.userName}</div>  
                    <figure style={{ backgroundColor: 'transparent'}} className="avatar tile-icon">
                        <img src={process.env.PUBLIC_URL + `/icons/banana-peel.svg`} />
                    </figure>
                    </div>
                </div>
            </div>
        )
    }))}
</React.Fragment>
    );
    
}
export default Scores;