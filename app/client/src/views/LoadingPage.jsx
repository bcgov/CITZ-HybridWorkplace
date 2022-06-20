import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingPage() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
}

export default LoadingPage;
