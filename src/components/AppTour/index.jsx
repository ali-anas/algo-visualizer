import Joyride, { STATUS } from 'react-joyride';
import stepsData from './AppTourData';
import { useState } from 'react';

const AppTour = () => {
  // const [tourInProgress, setTourInProgress] = useState(false);

  return (
    <>
      <Joyride
        steps={stepsData}
        continuous
      />
      {/* <button onClick={() => setTourInProgress(true)}>
        Take a Tour!
      </button> */}
    </>
  )
}

export default AppTour;