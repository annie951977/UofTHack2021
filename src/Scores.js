import React from 'react';

const maxPossibleScore = 100;

const Score = (userName, score) => {
    // <svg></svg>
}

const Scores = ({scores}) => {

    console.log(scores);
    let count = scores.length;
    return (
        <div>
    {(scores.map(elem => {
        
        console.log(String(elem.score*100/maxPossibleScore) + "%");
        return (
            <div class="progress" style={{width: "100%", height: "35px"}}>
                {/* <div class="progress-bar" in={maxPossibleScore} style={{height: "30px", width: String(elem.score/maxPossibleScore) + "%"}}> */}
                    <figure style={{ backgroundColor: 'transparent',  position: "absolute", left: String(elem.score*100/maxPossibleScore) + "%"}} className="avatar tile-icon">
                        <img src={process.env.PUBLIC_URL + `/icons/banana-peel.svg`} />
                    </figure>
                {/* </div> */}
                
            </div>
        )
    }))}
    </div>
    );
    
}
export default Scores;