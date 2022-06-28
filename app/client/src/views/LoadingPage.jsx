import { Grid, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingPage() {
  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item>
          <CircularProgress color="primary" />
        </Grid>
      </Grid>
    </div>
  );
}

export default LoadingPage;
