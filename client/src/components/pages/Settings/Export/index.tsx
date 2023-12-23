import { Button, Paper } from "eri";
import ExportControls from "./ExportControls";
import eventsSlice from "../../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Export() {
  const denormalizedMeditations = useSelector(
    eventsSlice.selectors.denormalizedMeditations,
  );
  const denormalizedMoods = useSelector(
    eventsSlice.selectors.denormalizedMoods,
  );
  const denormalizedWeights = useSelector(
    eventsSlice.selectors.denormalizedWeights,
  );
  const navigate = useNavigate();

  return (
    <Paper.Group>
      <Paper>
        <h2>Export data</h2>
        {!denormalizedMeditations.length &&
        !denormalizedMoods.length &&
        !denormalizedWeights.length ? (
          <>
            <p>No data to export</p>
            <Button.Group>
              <Button onClick={() => navigate(`/add`)} type="button">
                Add your first mood!
              </Button>
            </Button.Group>
          </>
        ) : (
          <>
            <p>
              You can download all your data from here. Choose CSV format if you
              want to load your data into a spreadsheet and take a closer look.
            </p>
            <h3>Moods</h3>
            <ExportControls
              category="moods"
              denormalizedData={denormalizedMoods}
            />
            <h3>Meditations</h3>
            <ExportControls
              category="meditations"
              denormalizedData={denormalizedMeditations}
            />
            <h3>Weights</h3>
            <ExportControls
              category="weights"
              denormalizedData={denormalizedWeights}
            />
          </>
        )}
      </Paper>
    </Paper.Group>
  );
}
