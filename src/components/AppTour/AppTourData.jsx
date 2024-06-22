import wallsDemo from '/assets/walls.mp4';
import liveResults from '/assets/liveResult.mp4'

const stepsData = [
  {
    content: (
      <>
        <h2>Click on the grid elements or drag to create or erase the wall.</h2>
        <br />
        <h2>Drag source and dest node to change their positions</h2>
        <br />
        <video autoPlay loop muted>
          <source src={wallsDemo} type="video/mp4" />
        </video>
      </>
    ),
    target: 'body',
    placement: 'center',
  },
  {
    content: (
      <h2>Choose an algorithm to find the path.</h2>
    ),
    target: '.algo-selector',
    placement: 'bottom',
  },
  {
    content: (
      <>
        <h2>Move the source/dest after execution of algorithm to see the live results</h2>
        <br />
        <video autoPlay loop muted>
          <source src={liveResults} type="video/mp4" />
        </video>
      </>
    ),
    target: 'body',
    placement: 'center',
  },
  {
    content: (
      <>
        <h2>Re-Run the algorithm or clear the grid</h2>
      </>
    ),
    target: '.controls',
    placement: 'bottom',
  }
];

export default stepsData;